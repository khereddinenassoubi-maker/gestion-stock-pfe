package com.gestionstock.service.impl;

import com.gestionstock.dto.ClientDTO;
import com.gestionstock.dto.PaiementClientDTO;
import com.gestionstock.entity.Client;
import com.gestionstock.entity.PaiementClient;
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

    @Override
    public ClientDTO ajouterClient(ClientDTO clientDTO) {

        Client client = Client.builder()
                .nom(clientDTO.getNom())
                .prenom(clientDTO.getPrenom())
                .telephone(clientDTO.getTelephone())
                .email(clientDTO.getEmail())
                .adresse(clientDTO.getAdresse())
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

            client.setNom(clientDTO.getNom());
            client.setPrenom(clientDTO.getPrenom());
            client.setTelephone(clientDTO.getTelephone());
            client.setEmail(clientDTO.getEmail());
            client.setAdresse(clientDTO.getAdresse());
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
    public PaiementClientDTO enregistrerPaiement(Long clientId, Double montant) {
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
                .client(client).montant(montant).datePaiement(LocalDateTime.now()).build());
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
                .creditRestant(creditRestant).build();
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
