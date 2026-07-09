package com.gestionstock.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VenteDTO {
    private Long id;
    private LocalDate dateVente;
    private Long clientId;
    private String clientNom;
    private Double total;
    private Double reste;
    private String modePaiement;
    private String statut;
    private String caissierNom;
    private List<LigneVenteDTO> lignes;
}
