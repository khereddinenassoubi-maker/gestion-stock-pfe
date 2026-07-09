package com.gestionstock.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "paiement_client")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaiementClient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDateTime datePaiement;
    private Double montant;
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;
}
