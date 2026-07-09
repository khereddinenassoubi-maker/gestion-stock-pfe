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
    private LocalDate dateVente;
    private Double total;
    @Enumerated(EnumType.STRING)
    private ModePaiement modePaiement;
    @Enumerated(EnumType.STRING)
    private StatutVente statut;
    private Double reste;
    private String caissierNom;
    @ManyToOne
    @JoinColumn(name = "client_id")
    private Client client;
}
