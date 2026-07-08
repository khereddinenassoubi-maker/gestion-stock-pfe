package com.gestionstock.service;

import com.gestionstock.dto.CategorieDTO;

import java.util.List;

public interface CategorieService {

    CategorieDTO ajouterCategorie(CategorieDTO categorieDTO);

    List<CategorieDTO> afficherCategories();

    CategorieDTO chercherParId(Long id);

    CategorieDTO modifierCategorie(Long id, CategorieDTO categorieDTO);

    void supprimerCategorie(Long id);
}