package com.gestionstock.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "article")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String description;

    @Column(unique = true)
    private String codeBarres;

    private Double prixAchat;

    private Double prixVente;

    private Double quantiteStock;

    private Double seuilStock;

    private Boolean actif = true;
}
