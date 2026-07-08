package com.gestionstock.service.impl;

import com.gestionstock.dto.CategorieDTO;
import com.gestionstock.entity.Categorie;
import com.gestionstock.repository.CategorieRepository;
import com.gestionstock.service.CategorieService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategorieServiceImpl implements CategorieService {

    private final CategorieRepository categorieRepository;

    @Override
    public CategorieDTO ajouterCategorie(CategorieDTO categorieDTO) {

        Categorie categorie = Categorie.builder()
                .nom(categorieDTO.getNom())
                .description(categorieDTO.getDescription())
                .build();

        return mapToDTO(categorieRepository.save(categorie));
    }

    @Override
    public List<CategorieDTO> afficherCategories() {

        return categorieRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategorieDTO chercherParId(Long id) {

        Categorie categorie = categorieRepository.findById(id).orElse(null);

        return mapToDTO(categorie);
    }

    @Override
    public CategorieDTO modifierCategorie(Long id, CategorieDTO categorieDTO) {

        Categorie categorie = categorieRepository.findById(id).orElse(null);

        if (categorie != null) {
            categorie.setNom(categorieDTO.getNom());
            categorie.setDescription(categorieDTO.getDescription());

            return mapToDTO(categorieRepository.save(categorie));
        }

        return null;
    }

    @Override
    public void supprimerCategorie(Long id) {

        categorieRepository.deleteById(id);
    }

    private CategorieDTO mapToDTO(Categorie categorie) {

        if (categorie == null) {
            return null;
        }

        return CategorieDTO.builder()
                .id(categorie.getId())
                .nom(categorie.getNom())
                .description(categorie.getDescription())
                .build();
    }
}
