package com.gestionstock.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchatDTO {

    private Long id;

    private LocalDate dateAchat;

    private Long fournisseurId;

    private String fournisseurNom;

    private Double total;

    private String caissierNom;

    private List<LigneAchatDTO> lignes;
}
