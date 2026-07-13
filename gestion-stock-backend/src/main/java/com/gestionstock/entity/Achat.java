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

    private LocalDate dateAchat;

    private Double total;

    private String caissierNom;

    @Enumerated(EnumType.STRING)
    private StatutAchat statut;

    @ManyToOne
    @JoinColumn(name = "fournisseur_id")
    private Fournisseur fournisseur;
}
