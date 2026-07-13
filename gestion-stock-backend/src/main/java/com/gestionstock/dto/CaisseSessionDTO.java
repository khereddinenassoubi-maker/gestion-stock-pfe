package com.gestionstock.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaisseSessionDTO {
    private Long id;
    private String caissierNom;
    private LocalDateTime dateOuverture;
    private LocalDateTime dateCloture;
    private Double montantOuverture;
    private Double fondSupplementaire;
    private Double montantCloture;
    private Double totalEspece;
    private Double totalCredit;
    private Double totalAchats;
    private Double soldeTheorique;
    private Double ecart;
    private String statut;
}
