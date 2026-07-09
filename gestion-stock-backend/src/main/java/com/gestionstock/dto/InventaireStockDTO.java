package com.gestionstock.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventaireStockDTO {
    private Long id;
    private Long articleId;
    private String articleNom;
    private LocalDateTime dateOperation;
    private String type;
    private Double quantiteAvant;
    private Double quantiteReelle;
    private Double ecart;
    private Double valeurEcart;
    private String motif;
    private String utilisateurNom;
}
