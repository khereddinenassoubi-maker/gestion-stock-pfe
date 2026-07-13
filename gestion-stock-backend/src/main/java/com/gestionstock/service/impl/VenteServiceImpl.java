package com.gestionstock.service.impl;

import com.gestionstock.dto.*;
import com.gestionstock.entity.*;
import com.gestionstock.enums.ModePaiement;
import com.gestionstock.enums.StatutCredit;
import com.gestionstock.enums.StatutVente;
import com.gestionstock.repository.*;
import com.gestionstock.service.VenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class VenteServiceImpl implements VenteService {
    private final VenteRepository venteRepository;
    private final LigneVenteRepository ligneRepository;
    private final ArticleRepository articleRepository;
    private final ClientRepository clientRepository;
    private final PaiementRepository paiementRepository;
    private final CreditClientRepository creditClientRepository;

    @Override
    @Transactional
    public VenteDTO enregistrer(VenteDTO dto) {
        valider(dto);
        Client client = chercherClient(dto);
        Vente vente = venteRepository.save(Vente.builder()
                .dateVente(dto.getDateVente() != null ? dto.getDateVente() : LocalDate.now())
                .client(client)
                .modePaiement(mode(dto))
                .statut(StatutVente.EN_COURS)
                .caissierNom(dto.getCaissierNom())
                .total(0.0)
                .reste(0.0)
                .build());
        appliquerLignes(vente, dto.getLignes());
        ajusterCredit(client, vente.getModePaiement(), vente.getTotal());
        synchroniserReglement(vente);
        return mapper(venteRepository.findById(vente.getId()).orElseThrow());
    }

    @Override
    public List<VenteDTO> afficher() {
        return venteRepository.findAll().stream().map(this::mapper).toList();
    }

    @Override
    public VenteDTO chercher(Long id) {
        return mapper(trouver(id));
    }

    @Override
    @Transactional
    public VenteDTO modifier(Long id, VenteDTO dto) {
        valider(dto);
        Vente vente = trouver(id);
        ajusterCredit(vente.getClient(), vente.getModePaiement(), -valeur(vente.getTotal()));
        restaurerStock(id);
        paiementRepository.deleteByVente_Id(id);
        creditClientRepository.deleteByVente_Id(id);
        ligneRepository.deleteByVente_Id(id);
        Client client = chercherClient(dto);
        vente.setClient(client);
        vente.setDateVente(dto.getDateVente() != null ? dto.getDateVente() : LocalDate.now());
        vente.setModePaiement(mode(dto));
        vente.setCaissierNom(dto.getCaissierNom());
        vente.setStatut(StatutVente.EN_COURS);
        appliquerLignes(vente, dto.getLignes());
        ajusterCredit(client, vente.getModePaiement(), vente.getTotal());
        synchroniserReglement(vente);
        return mapper(vente);
    }

    @Override
    @Transactional
    public VenteDTO annuler(Long id) {
        Vente vente = trouver(id);
        if (StatutVente.ANNULEE.equals(vente.getStatut())) {
            return mapper(vente);
        }
        ajusterCredit(vente.getClient(), vente.getModePaiement(), -valeur(vente.getTotal()));
        restaurerStock(id);
        paiementRepository.deleteByVente_Id(id);
        creditClientRepository.deleteByVente_Id(id);
        vente.setStatut(StatutVente.ANNULEE);
        vente.setReste(0.0);
        return mapper(venteRepository.save(vente));
    }

    @Override
    @Transactional
    public void supprimer(Long id) {
        Vente vente = trouver(id);
        if (!StatutVente.ANNULEE.equals(vente.getStatut())) {
            ajusterCredit(vente.getClient(), vente.getModePaiement(), -valeur(vente.getTotal()));
            restaurerStock(id);
        }
        paiementRepository.deleteByVente_Id(id);
        creditClientRepository.deleteByVente_Id(id);
        ligneRepository.deleteByVente_Id(id);
        venteRepository.deleteById(id);
    }

    private void appliquerLignes(Vente vente, List<LigneVenteDTO> lignes) {
        double total = 0;
        for (LigneVenteDTO dto : lignes) {
            Article article = articleRepository.findById(dto.getArticleId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Article introuvable."));
            double stock = article.getQuantiteStock() == null ? 0 : article.getQuantiteStock();
            if (dto.getQuantite() == null || dto.getQuantite() <= 0 || dto.getPrixVente() == null || dto.getPrixVente() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantité ou prix invalide.");
            }
            normaliserArticle(article);
            article.setQuantiteStock(stock - dto.getQuantite());
            articleRepository.save(article);
            double sousTotal = dto.getQuantite() * dto.getPrixVente();
            total += sousTotal;
            ligneRepository.save(LigneVente.builder().vente(vente).article(article)
                    .quantite(dto.getQuantite()).prixVente(dto.getPrixVente()).sousTotal(sousTotal).build());
        }
        vente.setTotal(total);
        vente.setReste(ModePaiement.CREDIT.equals(vente.getModePaiement()) ? total : 0.0);
        vente.setStatut(StatutVente.TERMINEE);
        venteRepository.save(vente);
    }

    private void restaurerStock(Long id) {
        for (LigneVente ligne : ligneRepository.findByVente_Id(id)) {
            Article article = ligne.getArticle();
            normaliserArticle(article);
            article.setQuantiteStock((article.getQuantiteStock() == null ? 0 : article.getQuantiteStock()) + ligne.getQuantite());
            articleRepository.save(article);
        }
    }

    private void normaliserArticle(Article article) {
        if (article == null) return;
        if (article.getPrixAchat() == null) article.setPrixAchat(0.0);
        if (article.getPrixVente() == null) article.setPrixVente(0.0);
        if (article.getQuantiteStock() == null) article.setQuantiteStock(0.0);
        if (article.getSeuilStock() == null) article.setSeuilStock(0.0);
        if (article.getActif() == null) article.setActif(true);
    }

    private void valider(VenteDTO dto) {
        if (dto.getLignes() == null || dto.getLignes().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La vente doit contenir au moins un article.");
        }
        if (ModePaiement.CREDIT.equals(mode(dto)) && dto.getClientId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un client enregistré est obligatoire pour une vente à crédit.");
        }
    }

    private Client chercherClient(VenteDTO dto) {
        if (dto.getClientId() == null) return null;
        return clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Client introuvable."));
    }

    private ModePaiement mode(VenteDTO dto) {
        if ("CREDIT".equalsIgnoreCase(dto.getModePaiement())) {
            return ModePaiement.CREDIT;
        }
        return ModePaiement.ESPECE;
    }

    private void ajusterCredit(Client client, ModePaiement modePaiement, double montant) {
        if (client == null || !ModePaiement.CREDIT.equals(modePaiement)) return;
        client.setCredit(Math.max(0, valeur(client.getCredit()) + montant));
        clientRepository.save(client);
    }

    private void synchroniserReglement(Vente vente) {
        if (ModePaiement.ESPECE.equals(vente.getModePaiement())) {
            paiementRepository.save(Paiement.builder()
                    .vente(vente)
                    .modePaiement(ModePaiement.ESPECE)
                    .montantPaye(valeur(vente.getTotal()))
                    .build());
            vente.setReste(0.0);
            vente.setStatut(StatutVente.TERMINEE);
            venteRepository.save(vente);
            return;
        }

        creditClientRepository.save(CreditClient.builder()
                .vente(vente)
                .client(vente.getClient())
                .date(vente.getDateVente() != null ? vente.getDateVente() : LocalDate.now())
                .montantTotal(valeur(vente.getTotal()))
                .montantPaye(0.0)
                .reste(valeur(vente.getTotal()))
                .statut(StatutCredit.EN_COURS)
                .build());
        vente.setReste(valeur(vente.getTotal()));
        vente.setStatut(StatutVente.TERMINEE);
        venteRepository.save(vente);
    }

    private double valeur(Double valeur) {
        return valeur == null ? 0.0 : valeur;
    }

    private Vente trouver(Long id) {
        return venteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vente introuvable."));
    }

    private VenteDTO mapper(Vente vente) {
        List<LigneVenteDTO> lignes = ligneRepository.findByVente_Id(vente.getId()).stream()
                .map(l -> LigneVenteDTO.builder().id(l.getId())
                        .articleId(l.getArticle() != null ? l.getArticle().getId() : null)
                        .articleNom(l.getArticle() != null ? l.getArticle().getNom() : "Article supprimé")
                        .quantite(l.getQuantite())
                        .prixVente(l.getPrixVente()).sousTotal(l.getSousTotal()).build())
                .toList();
        Client client = vente.getClient();
        return VenteDTO.builder().id(vente.getId()).dateVente(vente.getDateVente())
                .clientId(client != null ? client.getId() : null)
                .clientNom(client != null
                        ? client.getNom() + " " + (client.getPrenom() == null ? "" : client.getPrenom())
                        : "Passager")
                .modePaiement(vente.getModePaiement() != null ? vente.getModePaiement().name() : "ESPECE")
                .statut(vente.getStatut() != null ? vente.getStatut().name() : "TERMINEE")
                .caissierNom(vente.getCaissierNom())
                .total(vente.getTotal())
                .reste(vente.getReste())
                .lignes(lignes).build();
    }
}
