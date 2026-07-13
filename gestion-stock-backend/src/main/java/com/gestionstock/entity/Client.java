package com.gestionstock.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "client")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nom;

    @Column(length = 120)
    private String prenom;

    @Column(length = 30)
    private String telephone;

    @Column(length = 120)
    private String email;

    @Column(length = 255)
    private String adresse;

    @Builder.Default
    @Column(nullable = false)
    private Double credit = 0.0;
}
