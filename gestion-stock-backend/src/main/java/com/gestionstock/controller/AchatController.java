package com.gestionstock.controller;

import com.gestionstock.dto.AchatDTO;
import com.gestionstock.service.AchatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/achats")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AchatController {

    private final AchatService achatService;

    @PostMapping
    public AchatDTO enregistrer(@RequestBody AchatDTO achatDTO) {
        return achatService.enregistrerAchat(achatDTO);
    }

    @GetMapping
    public List<AchatDTO> afficher() {
        return achatService.afficherAchats();
    }

    @GetMapping("/{id}")
    public AchatDTO chercher(@PathVariable Long id) {
        return achatService.chercherParId(id);
    }

    @PutMapping("/{id}")
    public AchatDTO modifier(@PathVariable Long id,
                             @RequestBody AchatDTO achatDTO) {
        return achatService.modifierAchat(id, achatDTO);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        achatService.supprimerAchat(id);
    }
}