package com.gestionstock.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FournisseurDTO {

    private Long id;

    private String nom;

    private String telephone;

    private String email;

    private String adresse;
}