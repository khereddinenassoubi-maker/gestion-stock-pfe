package com.gestionstock.controller;

import com.gestionstock.dto.InventaireStockDTO;
import com.gestionstock.service.InventaireStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventaires")
@RequiredArgsConstructor
@CrossOrigin("*")
public class InventaireStockController {

    private final InventaireStockService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventaireStockDTO enregistrer(@RequestBody InventaireStockDTO dto) {
        return service.enregistrer(dto);
    }

    @GetMapping
    public List<InventaireStockDTO> afficher() {
        return service.afficher();
    }
}
