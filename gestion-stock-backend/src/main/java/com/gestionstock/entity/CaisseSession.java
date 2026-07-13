package com.gestionstock.entity;

import com.gestionstock.enums.StatutCaisse;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "caisse_session")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaisseSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String caissierNom;

    private LocalDateTime dateOuverture;

    private LocalDateTime dateCloture;

    private Double montantOuverture;

    private Double fondSupplementaire;

    private Double montantCloture;

    private Double totalEspece;

    private Double totalCredit;

    private Double totalAchats;

    private Double soldeTheorique;

    private Double ecart;

    @Enumerated(EnumType.STRING)
    private StatutCaisse statut;
}
