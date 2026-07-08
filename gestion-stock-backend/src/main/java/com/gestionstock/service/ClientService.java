package com.gestionstock.service;

import com.gestionstock.dto.ClientDTO;

import java.util.List;

public interface ClientService {

    ClientDTO ajouterClient(ClientDTO clientDTO);

    List<ClientDTO> afficherClients();

    ClientDTO chercherParId(Long id);

    ClientDTO modifierClient(Long id, ClientDTO clientDTO);

    void supprimerClient(Long id);
}