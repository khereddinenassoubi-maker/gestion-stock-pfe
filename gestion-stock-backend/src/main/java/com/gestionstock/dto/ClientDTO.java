package com.gestionstock.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientDTO {

    private Long id;

    private String nom;

    private String prenom;

    private String telephone;

    private String email;

    private String adresse;

    private Double credit;
}