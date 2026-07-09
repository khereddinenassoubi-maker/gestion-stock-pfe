package com.gestionstock.controller;

import com.gestionstock.dto.ClientDTO;
import com.gestionstock.dto.PaiementClientDTO;
import com.gestionstock.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public ClientDTO ajouter(@RequestBody ClientDTO clientDTO) {
        return clientService.ajouterClient(clientDTO);
    }

    @GetMapping
    public List<ClientDTO> afficher() {
        return clientService.afficherClients();
    }

    @GetMapping("/{id}")
    public ClientDTO chercherParId(@PathVariable Long id) {
        return clientService.chercherParId(id);
    }

    @PutMapping("/{id}")
    public ClientDTO modifier(@PathVariable Long id, @RequestBody ClientDTO clientDTO) {
        return clientService.modifierClient(id, clientDTO);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        clientService.supprimerClient(id);
    }

    @PostMapping("/{id}/paiements")
    public PaiementClientDTO enregistrerPaiement(@PathVariable Long id,
                                                  @RequestBody Map<String, Double> body) {
        return clientService.enregistrerPaiement(id, body.get("montant"));
    }

    @GetMapping("/{id}/paiements")
    public List<PaiementClientDTO> afficherPaiements(@PathVariable Long id) {
        return clientService.afficherPaiements(id);
    }
}
