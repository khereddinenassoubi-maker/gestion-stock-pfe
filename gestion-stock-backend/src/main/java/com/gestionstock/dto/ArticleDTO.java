package com.gestionstock.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ArticleDTO {

    private Long id;

    private String nom;

    private String description;

    private String codeBarres;

    private Double prixAchat;

    private Double prixVente;

    private Double quantiteStock;

    private Double seuilStock;

    private Boolean actif;

    private Long categorieId;

    private String categorieNom;
}