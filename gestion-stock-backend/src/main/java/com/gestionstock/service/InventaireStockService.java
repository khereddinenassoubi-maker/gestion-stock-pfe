package com.gestionstock.service;

import com.gestionstock.dto.InventaireStockDTO;

import java.util.List;

public interface InventaireStockService {
    InventaireStockDTO enregistrer(InventaireStockDTO dto);
    List<InventaireStockDTO> afficher();
}
