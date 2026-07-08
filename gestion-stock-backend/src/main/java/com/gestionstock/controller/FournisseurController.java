package com.gestionstock.controller;

import com.gestionstock.dto.FournisseurDTO;
import com.gestionstock.service.FournisseurService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fournisseurs")
@RequiredArgsConstructor
@CrossOrigin("*")
public class FournisseurController {

    private final FournisseurService fournisseurService;

    @PostMapping
    public FournisseurDTO ajouter(@RequestBody FournisseurDTO fournisseurDTO) {
        return fournisseurService.ajouterFournisseur(fournisseurDTO);
    }

    @GetMapping
    public List<FournisseurDTO> afficher() {
        return fournisseurService.afficherFournisseurs();
    }

    @GetMapping("/{id}")
    public FournisseurDTO chercherParId(@PathVariable Long id) {
        return fournisseurService.chercherParId(id);
    }

    @PutMapping("/{id}")
    public FournisseurDTO modifier(@PathVariable Long id, @RequestBody FournisseurDTO fournisseurDTO) {
        return fournisseurService.modifierFournisseur(id, fournisseurDTO);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        fournisseurService.supprimerFournisseur(id);
    }
}