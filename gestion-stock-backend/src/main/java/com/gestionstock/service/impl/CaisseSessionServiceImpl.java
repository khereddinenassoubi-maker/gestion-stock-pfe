package com.gestionstock.service.impl;

import com.gestionstock.dto.CaisseSessionDTO;
import com.gestionstock.entity.Achat;
import com.gestionstock.entity.CaisseSession;
import com.gestionstock.entity.Vente;
import com.gestionstock.enums.ModePaiement;
import com.gestionstock.enums.StatutCaisse;
import com.gestionstock.enums.StatutVente;
import com.gestionstock.repository.CaisseSessionRepository;
import com.gestionstock.repository.AchatRepository;
import com.gestionstock.repository.VenteRepository;
import com.gestionstock.service.CaisseSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CaisseSessionServiceImpl implements CaisseSessionService {

    private final CaisseSessionRepository caisseRepository;
    private final VenteRepository venteRepository;
    private final AchatRepository achatRepository;

    @Override
    public CaisseSessionDTO ouvrir(CaisseSessionDTO dto) {
        String caissier = nomCaissier(dto.getCaissierNom());
        caisseRepository.findFirstByCaissierNomAndStatutOrderByDateOuvertureDesc(caissier, StatutCaisse.OUVERTE)
                .ifPresent(c -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Une caisse est deja ouverte pour ce caissier.");
                });

        CaisseSession caisse = caisseRepository.save(CaisseSession.builder()
                .caissierNom(caissier)
                .dateOuverture(LocalDateTime.now())
                .montantOuverture(valeur(dto.getMontantOuverture()))
                .fondSupplementaire(0.0)
                .montantCloture(0.0)
                .totalEspece(0.0)
                .totalCredit(0.0)
                .totalAchats(0.0)
                .soldeTheorique(valeur(dto.getMontantOuverture()))
                .ecart(0.0)
                .statut(StatutCaisse.OUVERTE)
                .build());
        return mapper(caisse);
    }

    @Override
    public CaisseSessionDTO ajouterFond(Long id, CaisseSessionDTO dto) {
        CaisseSession caisse = caisseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caisse introuvable."));
        if (StatutCaisse.CLOTUREE.equals(caisse.getStatut())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Caisse deja cloturee.");
        }
        double montant = valeur(dto.getFondSupplementaire());
        if (montant <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Montant invalide.");
        }
        caisse.setFondSupplementaire(valeur(caisse.getFondSupplementaire()) + montant);
        TotauxCaisse totaux = calculerTotaux(caisse.getCaissierNom(), caisse.getDateOuverture().toLocalDate(), LocalDate.now());
        appliquerTotaux(caisse, totaux);
        return mapper(caisseRepository.save(caisse));
    }

    @Override
    public CaisseSessionDTO cloturer(Long id, CaisseSessionDTO dto) {
        CaisseSession caisse = caisseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Caisse introuvable."));
        if (StatutCaisse.CLOTUREE.equals(caisse.getStatut())) {
            return mapper(caisse);
        }

        LocalDateTime cloture = LocalDateTime.now();
        TotauxCaisse totaux = calculerTotaux(caisse.getCaissierNom(), caisse.getDateOuverture().toLocalDate(), cloture.toLocalDate());
        double montantCloture = valeur(dto.getMontantCloture());

        caisse.setDateCloture(cloture);
        appliquerTotaux(caisse, totaux);
        caisse.setMontantCloture(montantCloture);
        caisse.setEcart(montantCloture - valeur(caisse.getSoldeTheorique()));
        caisse.setStatut(StatutCaisse.CLOTUREE);
        return mapper(caisseRepository.save(caisse));
    }

    @Override
    public List<CaisseSessionDTO> afficher() {
        return caisseRepository.findAll().stream()
                .sorted((a, b) -> b.getDateOuverture().compareTo(a.getDateOuverture()))
                .map(this::mapper)
                .toList();
    }

    @Override
    public CaisseSessionDTO caisseOuverte(String caissierNom) {
        return caisseRepository.findFirstByCaissierNomAndStatutOrderByDateOuvertureDesc(nomCaissier(caissierNom), StatutCaisse.OUVERTE)
                .map(this::mapper)
                .orElse(null);
    }

    private TotauxCaisse calculerTotaux(String caissierNom, LocalDate debut, LocalDate fin) {
        double espece = 0.0;
        double credit = 0.0;
        double achats = 0.0;
        for (Vente vente : venteRepository.findAll()) {
            if (vente.getDateVente() == null || vente.getStatut() == StatutVente.ANNULEE) continue;
            if (vente.getCaissierNom() == null || !vente.getCaissierNom().equalsIgnoreCase(caissierNom)) continue;
            if (vente.getDateVente().isBefore(debut) || vente.getDateVente().isAfter(fin)) continue;
            if (ModePaiement.CREDIT.equals(vente.getModePaiement())) {
                credit += valeur(vente.getTotal());
            } else {
                espece += valeur(vente.getTotal());
            }
        }
        for (Achat achat : achatRepository.findAll()) {
            if (achat.getDateAchat() == null) continue;
            if (achat.getCaissierNom() == null || !achat.getCaissierNom().equalsIgnoreCase(caissierNom)) continue;
            if (achat.getDateAchat().isBefore(debut) || achat.getDateAchat().isAfter(fin)) continue;
            achats += valeur(achat.getTotal());
        }
        return new TotauxCaisse(espece, credit, achats);
    }

    private void appliquerTotaux(CaisseSession caisse, TotauxCaisse totaux) {
        caisse.setTotalEspece(totaux.espece);
        caisse.setTotalCredit(totaux.credit);
        caisse.setTotalAchats(totaux.achats);
        caisse.setSoldeTheorique(
                valeur(caisse.getMontantOuverture())
                        + valeur(caisse.getFondSupplementaire())
                        + totaux.espece
                        - totaux.achats
        );
    }

    private CaisseSessionDTO mapper(CaisseSession caisse) {
        if (caisse.getDateOuverture() != null && StatutCaisse.OUVERTE.equals(caisse.getStatut())) {
            TotauxCaisse totaux = calculerTotaux(caisse.getCaissierNom(), caisse.getDateOuverture().toLocalDate(), LocalDate.now());
            appliquerTotaux(caisse, totaux);
        }
        return CaisseSessionDTO.builder()
                .id(caisse.getId())
                .caissierNom(caisse.getCaissierNom())
                .dateOuverture(caisse.getDateOuverture())
                .dateCloture(caisse.getDateCloture())
                .montantOuverture(caisse.getMontantOuverture())
                .fondSupplementaire(caisse.getFondSupplementaire())
                .montantCloture(caisse.getMontantCloture())
                .totalEspece(caisse.getTotalEspece())
                .totalCredit(caisse.getTotalCredit())
                .totalAchats(caisse.getTotalAchats())
                .soldeTheorique(caisse.getSoldeTheorique())
                .ecart(caisse.getEcart())
                .statut(caisse.getStatut() != null ? caisse.getStatut().name() : null)
                .build();
    }

    private String nomCaissier(String nom) {
        return nom == null || nom.isBlank() ? "Caissier" : nom.trim();
    }

    private double valeur(Double valeur) {
        return valeur == null ? 0.0 : valeur;
    }

    private record TotauxCaisse(double espece, double credit, double achats) {}
}
