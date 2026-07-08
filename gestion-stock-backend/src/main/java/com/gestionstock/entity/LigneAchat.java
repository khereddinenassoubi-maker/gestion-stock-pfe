package com.gestionstock.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ligne_achat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LigneAchat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double quantite;

    private Double prixAchat;

    private Double sousTotal;

    @ManyToOne
    @JoinColumn(name = "achat_id")
    private Achat achat;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;
}