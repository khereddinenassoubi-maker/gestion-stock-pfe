package com.gestionstock.service.impl;

import com.gestionstock.dto.FournisseurDTO;
import com.gestionstock.entity.Fournisseur;
import com.gestionstock.repository.FournisseurRepository;
import com.gestionstock.service.FournisseurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepository fournisseurRepository;

    @Override
    public FournisseurDTO ajouterFournisseur(FournisseurDTO fournisseurDTO) {
        Fournisseur fournisseur = Fournisseur.builder()
                .nom(fournisseurDTO.getNom())
                .telephone(fournisseurDTO.getTelephone())
                .email(fournisseurDTO.getEmail())
                .adresse(fournisseurDTO.getAdresse())
                .build();

        return mapToDTO(fournisseurRepository.save(fournisseur));
    }

    @Override
    public List<FournisseurDTO> afficherFournisseurs() {
        return fournisseurRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FournisseurDTO chercherParId(Long id) {
        Fournisseur fournisseur = fournisseurRepository.findById(id).orElse(null);
        return mapToDTO(fournisseur);
    }

    @Override
    public FournisseurDTO modifierFournisseur(Long id, FournisseurDTO fournisseurDTO) {
        Fournisseur fournisseur = fournisseurRepository.findById(id).orElse(null);

        if (fournisseur != null) {
            fournisseur.setNom(fournisseurDTO.getNom());
            fournisseur.setTelephone(fournisseurDTO.getTelephone());
            fournisseur.setEmail(fournisseurDTO.getEmail());
            fournisseur.setAdresse(fournisseurDTO.getAdresse());

            return mapToDTO(fournisseurRepository.save(fournisseur));
        }

        return null;
    }

    @Override
    public void supprimerFournisseur(Long id) {
        fournisseurRepository.deleteById(id);
    }

    private FournisseurDTO mapToDTO(Fournisseur fournisseur) {
        if (fournisseur == null) {
            return null;
        }

        return FournisseurDTO.builder()
                .id(fournisseur.getId())
                .nom(fournisseur.getNom())
                .telephone(fournisseur.getTelephone())
                .email(fournisseur.getEmail())
                .adresse(fournisseur.getAdresse())
                .build();
    }
}