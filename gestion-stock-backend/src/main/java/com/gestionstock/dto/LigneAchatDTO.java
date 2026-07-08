package com.gestionstock.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LigneAchatDTO {

    private Long id;

    private Long articleId;

    private String articleNom;

    private Double quantite;

    private Double prixAchat;

    private Double sousTotal;
}