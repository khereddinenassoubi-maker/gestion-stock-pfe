package com.gestionstock.entity;

import com.gestionstock.enums.ModePaiement;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "paiement")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Paiement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double montantPaye;

    @Enumerated(EnumType.STRING)
    private ModePaiement modePaiement;

    @OneToOne
    @JoinColumn(name = "vente_id")
    private Vente vente;
}
