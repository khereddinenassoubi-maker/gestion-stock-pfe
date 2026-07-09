package com.gestionstock.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UtilisateurDTO {
    private Long id;
    private String username;
    private String password;
    private String nom;
    private String prenom;
    private String email;
    private String role;
    private Boolean actif;
    private String departement;
    private Boolean caisseOuverte;
}
