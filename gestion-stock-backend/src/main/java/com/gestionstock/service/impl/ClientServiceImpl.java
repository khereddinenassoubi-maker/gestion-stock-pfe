package com.gestionstock.service.impl;

import com.gestionstock.dto.ClientDTO;
import com.gestionstock.entity.Client;
import com.gestionstock.repository.ClientRepository;
import com.gestionstock.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Override
    public ClientDTO ajouterClient(ClientDTO clientDTO) {

        Client client = Client.builder()
                .nom(clientDTO.getNom())
                .prenom(clientDTO.getPrenom())
                .telephone(clientDTO.getTelephone())
                .email(clientDTO.getEmail())
                .adresse(clientDTO.getAdresse())
                .credit(clientDTO.getCredit())
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
            client.setCredit(clientDTO.getCredit());

            Client updatedClient = clientRepository.save(client);

            return mapToDTO(updatedClient);
        }

        return null;
    }

    @Override
    public void supprimerClient(Long id) {

        clientRepository.deleteById(id);
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