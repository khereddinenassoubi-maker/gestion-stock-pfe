package com.gestionstock.controller;

import com.gestionstock.dto.VenteDTO;
import com.gestionstock.service.VenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ventes")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VenteController {
    private final VenteService service;
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public VenteDTO ajouter(@RequestBody VenteDTO dto) { return service.enregistrer(dto); }
    @GetMapping
    public List<VenteDTO> afficher() { return service.afficher(); }
    @GetMapping("/{id}")
    public VenteDTO chercher(@PathVariable Long id) { return service.chercher(id); }
    @PutMapping("/{id}")
    public VenteDTO modifier(@PathVariable Long id, @RequestBody VenteDTO dto) { return service.modifier(id, dto); }
    @PutMapping("/{id}/annuler")
    public VenteDTO annuler(@PathVariable Long id) { return service.annuler(id); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Long id) { service.supprimer(id); }
}
