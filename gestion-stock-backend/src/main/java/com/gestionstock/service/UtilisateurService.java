package com.gestionstock.service;

import com.gestionstock.dto.UtilisateurDTO;

import java.util.List;

public interface UtilisateurService {
    UtilisateurDTO enregistrer(UtilisateurDTO dto);
    UtilisateurDTO login(UtilisateurDTO dto);
    List<UtilisateurDTO> afficher();
    UtilisateurDTO modifier(Long id, UtilisateurDTO dto);
    void supprimer(Long id);
}
