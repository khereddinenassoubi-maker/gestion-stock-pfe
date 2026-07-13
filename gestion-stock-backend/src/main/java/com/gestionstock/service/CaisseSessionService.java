package com.gestionstock.service;

import com.gestionstock.dto.CaisseSessionDTO;

import java.util.List;

public interface CaisseSessionService {
    CaisseSessionDTO ouvrir(CaisseSessionDTO dto);
    CaisseSessionDTO ajouterFond(Long id, CaisseSessionDTO dto);
    CaisseSessionDTO cloturer(Long id, CaisseSessionDTO dto);
    List<CaisseSessionDTO> afficher();
    CaisseSessionDTO caisseOuverte(String caissierNom);
}
