package com.gestionstock.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategorieDTO {

    private Long id;

    private String nom;

    private String description;
}