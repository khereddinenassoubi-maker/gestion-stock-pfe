package com.gestionstock.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ligne_vente")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LigneVente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double quantite;
    private Double prixVente;
    private Double sousTotal;
    @ManyToOne
    @JoinColumn(name = "vente_id")
    private Vente vente;
    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;
}
