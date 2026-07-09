package com.gestionstock.controller;

import com.gestionstock.dto.CaisseSessionDTO;
import com.gestionstock.service.CaisseSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caisses")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CaisseSessionController {

    private final CaisseSessionService service;

    @PostMapping("/ouvrir")
    @ResponseStatus(HttpStatus.CREATED)
    public CaisseSessionDTO ouvrir(@RequestBody CaisseSessionDTO dto) {
        return service.ouvrir(dto);
    }

    @PutMapping("/{id}/cloturer")
    public CaisseSessionDTO cloturer(@PathVariable Long id, @RequestBody CaisseSessionDTO dto) {
        return service.cloturer(id, dto);
    }

    @GetMapping
    public List<CaisseSessionDTO> afficher() {
        return service.afficher();
    }

    @GetMapping("/ouverte")
    public CaisseSessionDTO caisseOuverte(@RequestParam String caissierNom) {
        return service.caisseOuverte(caissierNom);
    }
}
