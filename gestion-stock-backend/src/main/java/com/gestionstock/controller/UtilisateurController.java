package com.gestionstock.controller;

import com.gestionstock.dto.UtilisateurDTO;
import com.gestionstock.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class UtilisateurController {
    private final UtilisateurService utilisateurService;

    @PostMapping
    public UtilisateurDTO enregistrer(@RequestBody UtilisateurDTO dto) {
        return utilisateurService.enregistrer(dto);
    }

    @GetMapping
    public List<UtilisateurDTO> afficher() {
        return utilisateurService.afficher();
    }

    @PutMapping("/{id}")
    public UtilisateurDTO modifier(@PathVariable Long id, @RequestBody UtilisateurDTO dto) {
        return utilisateurService.modifier(id, dto);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        utilisateurService.supprimer(id);
    }
}
