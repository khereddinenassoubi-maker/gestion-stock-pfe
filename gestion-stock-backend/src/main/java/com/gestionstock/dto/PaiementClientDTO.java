package com.gestionstock.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaiementClientDTO {
    private Long id;
    private Long clientId;
    private LocalDateTime datePaiement;
    private Double montant;
    private Double creditRestant;
    private String caissierNom;
}
