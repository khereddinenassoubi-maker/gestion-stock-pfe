package com.gestionstock.service;

import com.gestionstock.dto.ClientDTO;
import com.gestionstock.dto.PaiementClientDTO;

import java.util.List;

public interface ClientService {

    ClientDTO ajouterClient(ClientDTO clientDTO);

    List<ClientDTO> afficherClients();

    ClientDTO chercherParId(Long id);

    ClientDTO modifierClient(Long id, ClientDTO clientDTO);

    void supprimerClient(Long id);

    PaiementClientDTO enregistrerPaiement(Long clientId, Double montant, String caissierNom);

    List<PaiementClientDTO> afficherPaiements(Long clientId);
}
