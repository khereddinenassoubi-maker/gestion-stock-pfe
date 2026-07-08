package com.gestionstock.controller;

import com.gestionstock.dto.CategorieDTO;
import com.gestionstock.service.CategorieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CategorieController {

    private final CategorieService categorieService;

    @PostMapping
    public CategorieDTO ajouter(@RequestBody CategorieDTO categorieDTO) {
        return categorieService.ajouterCategorie(categorieDTO);
    }

    @GetMapping
    public List<CategorieDTO> afficher() {
        return categorieService.afficherCategories();
    }

    @GetMapping("/{id}")
    public CategorieDTO chercherParId(@PathVariable Long id) {
        return categorieService.chercherParId(id);
    }

    @PutMapping("/{id}")
    public CategorieDTO modifier(@PathVariable Long id,
                                 @RequestBody CategorieDTO categorieDTO) {
        return categorieService.modifierCategorie(id, categorieDTO);
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        categorieService.supprimerCategorie(id);
    }
}