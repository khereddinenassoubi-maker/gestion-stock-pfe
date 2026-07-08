package com.gestionstock.service;

import com.gestionstock.dto.FournisseurDTO;

import java.util.List;

public interface FournisseurService {

    FournisseurDTO ajouterFournisseur(FournisseurDTO fournisseurDTO);

    List<FournisseurDTO> afficherFournisseurs();

    FournisseurDTO chercherParId(Long id);

    FournisseurDTO modifierFournisseur(Long id, FournisseurDTO fournisseurDTO);

    void supprimerFournisseur(Long id);
}