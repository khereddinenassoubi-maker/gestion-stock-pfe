package com.gestionstock.entity;

import com.gestionstock.enums.TypeInventaire;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventaire_stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventaireStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "article_id")
    private Article article;

    private LocalDateTime dateOperation;

    @Enumerated(EnumType.STRING)
    private TypeInventaire type;

    private Double quantiteAvant;

    private Double quantiteReelle;

    private Double ecart;

    private Double valeurEcart;

    private String motif;

    private String utilisateurNom;
}
