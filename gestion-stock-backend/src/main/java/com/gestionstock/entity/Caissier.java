package com.gestionstock.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "caissier")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Caissier extends Utilisateur {
    private Boolean caisseOuverte = false;
}
