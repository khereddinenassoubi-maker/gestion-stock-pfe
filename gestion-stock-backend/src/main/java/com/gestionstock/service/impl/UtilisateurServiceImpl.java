package com.gestionstock.service.impl;

import com.gestionstock.dto.UtilisateurDTO;
import com.gestionstock.entity.Administrateur;
import com.gestionstock.entity.Caissier;
import com.gestionstock.entity.Utilisateur;
import com.gestionstock.enums.Role;
import com.gestionstock.repository.UtilisateurRepository;
import com.gestionstock.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;

    @Override
    public UtilisateurDTO enregistrer(UtilisateurDTO dto) {
        valider(dto);
        Utilisateur utilisateur = creerSelonRole(dto);
        remplirCommun(utilisateur, dto);
        return mapper(utilisateurRepository.save(utilisateur));
    }

    @Override
    public List<UtilisateurDTO> afficher() {
        return utilisateurRepository.findAll().stream().map(this::mapper).toList();
    }

    @Override
    public UtilisateurDTO modifier(Long id, UtilisateurDTO dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur introuvable."));
        remplirCommun(utilisateur, dto);
        if (utilisateur instanceof Administrateur admin) {
            admin.setDepartement(dto.getDepartement());
        }
        if (utilisateur instanceof Caissier caissier) {
            caissier.setCaisseOuverte(Boolean.TRUE.equals(dto.getCaisseOuverte()));
        }
        return mapper(utilisateurRepository.save(utilisateur));
    }

    @Override
    public void supprimer(Long id) {
        utilisateurRepository.deleteById(id);
    }

    private Utilisateur creerSelonRole(UtilisateurDTO dto) {
        if ("ADMIN".equalsIgnoreCase(dto.getRole())) {
            Administrateur admin = new Administrateur();
            admin.setDepartement(dto.getDepartement());
            return admin;
        }
        Caissier caissier = new Caissier();
        caissier.setCaisseOuverte(Boolean.TRUE.equals(dto.getCaisseOuverte()));
        return caissier;
    }

    private void remplirCommun(Utilisateur utilisateur, UtilisateurDTO dto) {
        utilisateur.setUsername(dto.getUsername());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            utilisateur.setPassword(dto.getPassword());
        }
        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setRole("ADMIN".equalsIgnoreCase(dto.getRole()) ? Role.ADMIN : Role.CAISSIER);
        utilisateur.setActif(dto.getActif() == null || dto.getActif());
    }

    private void valider(UtilisateurDTO dto) {
        if (dto.getUsername() == null || dto.getUsername().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom d'utilisateur est obligatoire.");
        }
        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le mot de passe est obligatoire.");
        }
    }

    private UtilisateurDTO mapper(Utilisateur utilisateur) {
        return UtilisateurDTO.builder()
                .id(utilisateur.getId())
                .username(utilisateur.getUsername())
                .nom(utilisateur.getNom())
                .prenom(utilisateur.getPrenom())
                .email(utilisateur.getEmail())
                .role(utilisateur.getRole() != null ? utilisateur.getRole().name() : null)
                .actif(utilisateur.getActif())
                .departement(utilisateur instanceof Administrateur admin ? admin.getDepartement() : null)
                .caisseOuverte(utilisateur instanceof Caissier caissier ? caissier.getCaisseOuverte() : null)
                .build();
    }
}
