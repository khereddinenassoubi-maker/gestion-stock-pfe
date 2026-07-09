package com.gestionstock.entity;

import com.gestionstock.enums.StatutCredit;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "credit_client")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreditClient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private Double montantTotal;
    private Double montantPaye;
    private Double reste;

    @Enumerated(EnumType.STRING)
    private StatutCredit statut;

    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;

    @OneToOne
    @JoinColumn(name = "vente_id")
    private Vente vente;
}
