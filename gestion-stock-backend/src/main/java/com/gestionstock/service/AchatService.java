package com.gestionstock.service;

import com.gestionstock.dto.AchatDTO;

import java.util.List;

public interface AchatService {

    AchatDTO enregistrerAchat(AchatDTO achatDTO);

    List<AchatDTO> afficherAchats();

    AchatDTO chercherParId(Long id);

    AchatDTO modifierAchat(Long id, AchatDTO achatDTO);

    void supprimerAchat(Long id);
}