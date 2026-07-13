package com.gestionstock.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import com.gestionstock.enums.StatutAchat;

@Entity
@Table(name = "achat")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate dateAchat;

    @Column(nullable = false)
    private Double total;

    @Column(nullable = false, length = 100)
    private String caissierNom;

    @Enumerated(EnumType.STRING)
    private StatutAchat statut;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;
}
