package com.gestionstock.service.impl;

import com.gestionstock.dto.ClientDTO;
import com.gestionstock.dto.PaiementClientDTO;
import com.gestionstock.entity.CaisseSession;
import com.gestionstock.entity.Client;
import com.gestionstock.entity.PaiementClient;
import com.gestionstock.enums.StatutCaisse;
import com.gestionstock.repository.CaisseSessionRepository;
import com.gestionstock.repository.ClientRepository;
import com.gestionstock.repository.PaiementClientRepository;
import com.gestionstock.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;
    private final PaiementClientRepository paiementClientRepository;
    private final CaisseSessionRepository caisseSessionRepository;

    @Override
    public ClientDTO ajouterClient(ClientDTO clientDTO) {
        valider(clientDTO);

        Client client = Client.builder()
                .nom(nettoyer(clientDTO.getNom()))
                .prenom(nettoyer(clientDTO.getPrenom()))
                .telephone(nettoyer(clientDTO.getTelephone()))
                .email(nettoyer(clientDTO.getEmail()))
                .adresse(nettoyer(clientDTO.getAdresse()))
                .credit(0.0)
                .build();

        Client savedClient = clientRepository.save(client);

        return mapToDTO(savedClient);
    }

    @Override
    public List<ClientDTO> afficherClients() {

        return clientRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ClientDTO chercherParId(Long id) {

        Client client = clientRepository.findById(id).orElse(null);

        return mapToDTO(client);
    }

    @Override
    public ClientDTO modifierClient(Long id, ClientDTO clientDTO) {

        Client client = clientRepository.findById(id).orElse(null);

        if (client != null) {
            valider(clientDTO);

            client.setNom(nettoyer(clientDTO.getNom()));
            client.setPrenom(nettoyer(clientDTO.getPrenom()));
            client.setTelephone(nettoyer(clientDTO.getTelephone()));
            client.setEmail(nettoyer(clientDTO.getEmail()));
            client.setAdresse(nettoyer(clientDTO.getAdresse()));
            Client updatedClient = clientRepository.save(client);

            return mapToDTO(updatedClient);
        }

        return null;
    }

    @Override
    public void supprimerClient(Long id) {

        clientRepository.deleteById(id);
    }

    @Override
    @Transactional
    public PaiementClientDTO enregistrerPaiement(Long clientId, Double montant, String caissierNom) {
        String caissier = nomCaissier(caissierNom);
        verifierCaisseOuverte(caissier);
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client introuvable."));
        if (montant == null || montant <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le montant doit être supérieur à zéro.");
        }
        double credit = client.getCredit() == null ? 0.0 : client.getCredit();
        if (montant > credit) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "L'avance ne peut pas dépasser le crédit restant.");
        }
        client.setCredit(credit - montant);
        clientRepository.save(client);
        PaiementClient paiement = paiementClientRepository.save(PaiementClient.builder()
                .client(client)
                .montant(montant)
                .caissierNom(caissier)
                .datePaiement(LocalDateTime.now())
                .build());
        return mapPaiement(paiement, client.getCredit());
    }

    @Override
    public List<PaiementClientDTO> afficherPaiements(Long clientId) {
        return paiementClientRepository.findByClient_IdOrderByDatePaiementDesc(clientId)
                .stream().map(p -> mapPaiement(p, null)).collect(Collectors.toList());
    }

    private PaiementClientDTO mapPaiement(PaiementClient paiement, Double creditRestant) {
        return PaiementClientDTO.builder().id(paiement.getId())
                .clientId(paiement.getClient().getId())
                .datePaiement(paiement.getDatePaiement()).montant(paiement.getMontant())
                .creditRestant(creditRestant)
                .caissierNom(paiement.getCaissierNom())
                .build();
    }

    private String nomCaissier(String nom) {
        return nom == null || nom.isBlank() ? "Caissier" : nom.trim();
    }

    private CaisseSession verifierCaisseOuverte(String caissierNom) {
        return caisseSessionRepository
                .findFirstByCaissierNomAndStatutOrderByDateOuvertureDesc(caissierNom, StatutCaisse.OUVERTE)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Caisse fermee. Ouvrir la caisse avant d'effectuer cette operation."));
    }

    private void valider(ClientDTO clientDTO) {
        if (clientDTO.getNom() == null || clientDTO.getNom().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom du client est obligatoire.");
        }
        if (clientDTO.getEmail() != null && !clientDTO.getEmail().isBlank() && !clientDTO.getEmail().contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email client invalide.");
        }
    }

    private String nettoyer(String valeur) {
        return valeur == null ? null : valeur.trim();
    }

    private ClientDTO mapToDTO(Client client) {

        if (client == null) {
            return null;
        }

        return ClientDTO.builder()
                .id(client.getId())
                .nom(client.getNom())
                .prenom(client.getPrenom())
                .telephone(client.getTelephone())
                .email(client.getEmail())
                .adresse(client.getAdresse())
                .credit(client.getCredit())
                .build();
    }
}
