package com.gestionstock.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "administrateur")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Administrateur extends Utilisateur {
    private String departement;
}
