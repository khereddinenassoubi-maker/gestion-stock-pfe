package com.gestionstock.service;

import com.gestionstock.dto.VenteDTO;
import java.util.List;

public interface VenteService {
    VenteDTO enregistrer(VenteDTO dto);
    List<VenteDTO> afficher();
    VenteDTO chercher(Long id);
    VenteDTO modifier(Long id, VenteDTO dto);
    VenteDTO annuler(Long id);
    void supprimer(Long id);
}
