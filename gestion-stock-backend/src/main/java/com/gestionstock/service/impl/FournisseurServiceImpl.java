package com.gestionstock.service.impl;

import com.gestionstock.dto.FournisseurDTO;
import com.gestionstock.entity.Fournisseur;
import com.gestionstock.repository.FournisseurRepository;
import com.gestionstock.service.FournisseurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FournisseurServiceImpl implements FournisseurService {

    private final FournisseurRepository fournisseurRepository;

    @Override
    public FournisseurDTO ajouterFournisseur(FournisseurDTO fournisseurDTO) {
        valider(fournisseurDTO);
        Fournisseur fournisseur = Fournisseur.builder()
                .nom(nettoyer(fournisseurDTO.getNom()))
                .telephone(nettoyer(fournisseurDTO.getTelephone()))
                .email(nettoyer(fournisseurDTO.getEmail()))
                .adresse(nettoyer(fournisseurDTO.getAdresse()))
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
            valider(fournisseurDTO);
            fournisseur.setNom(nettoyer(fournisseurDTO.getNom()));
            fournisseur.setTelephone(nettoyer(fournisseurDTO.getTelephone()));
            fournisseur.setEmail(nettoyer(fournisseurDTO.getEmail()));
            fournisseur.setAdresse(nettoyer(fournisseurDTO.getAdresse()));

            return mapToDTO(fournisseurRepository.save(fournisseur));
        }

        return null;
    }

    @Override
    public void supprimerFournisseur(Long id) {
        fournisseurRepository.deleteById(id);
    }

    private void valider(FournisseurDTO fournisseurDTO) {
        if (fournisseurDTO.getNom() == null || fournisseurDTO.getNom().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom du fournisseur est obligatoire.");
        }
        if (fournisseurDTO.getEmail() != null && !fournisseurDTO.getEmail().isBlank() && !fournisseurDTO.getEmail().contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email fournisseur invalide.");
        }
    }

    private String nettoyer(String valeur) {
        return valeur == null ? null : valeur.trim();
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
