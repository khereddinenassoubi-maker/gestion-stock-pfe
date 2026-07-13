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

    @Column(nullable = false, length = 120)
    private String nom;

    @Column(length = 255)
    private String description;

    @Column(unique = true, length = 80)
    private String codeBarres;

    @Column(nullable = false)
    private Double prixAchat;

    @Column(nullable = false)
    private Double prixVente;

    @Column(nullable = false)
    private Double quantiteStock;

    @Column(nullable = false)
    private Double seuilStock;

    @Builder.Default
    @Column(nullable = false)
    private Boolean actif = true;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;
}
