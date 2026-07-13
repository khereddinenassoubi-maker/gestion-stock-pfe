package com.gestionstock.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import com.gestionstock.enums.ModePaiement;
import com.gestionstock.enums.StatutVente;

@Entity
@Table(name = "vente")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private LocalDate dateVente;

    @Column(nullable = false)
    private Double total;
    @Enumerated(EnumType.STRING)
    private ModePaiement modePaiement;
    @Enumerated(EnumType.STRING)
    private StatutVente statut;
    @Column(nullable = false)
    private Double reste;

    @Column(nullable = false, length = 100)
    private String caissierNom;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
}
