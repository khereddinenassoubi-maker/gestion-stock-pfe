package com.gestionstock.service.impl;

import com.gestionstock.dto.AchatDTO;
import com.gestionstock.dto.LigneAchatDTO;
import com.gestionstock.entity.Achat;
import com.gestionstock.entity.Article;
import com.gestionstock.entity.Fournisseur;
import com.gestionstock.entity.LigneAchat;
import com.gestionstock.enums.StatutAchat;
import com.gestionstock.repository.AchatRepository;
import com.gestionstock.repository.ArticleRepository;
import com.gestionstock.repository.FournisseurRepository;
import com.gestionstock.repository.LigneAchatRepository;
import com.gestionstock.service.AchatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AchatServiceImpl implements AchatService {

    private final AchatRepository achatRepository;
    private final LigneAchatRepository ligneAchatRepository;
    private final ArticleRepository articleRepository;
    private final FournisseurRepository fournisseurRepository;

    @Override
    public AchatDTO enregistrerAchat(AchatDTO achatDTO) {
        Fournisseur fournisseur = fournisseurRepository.findById(achatDTO.getFournisseurId()).orElse(null);

        Achat achat = Achat.builder()
                .dateAchat(achatDTO.getDateAchat())
                .fournisseur(fournisseur)
                .total(0.0)
                .statut(StatutAchat.EN_COURS)
                .build();

        Achat savedAchat = achatRepository.save(achat);
        double total = 0.0;

        for (LigneAchatDTO ligneDTO : achatDTO.getLignes()) {
            Article article = articleRepository.findById(ligneDTO.getArticleId()).orElse(null);

            if (article != null) {
                double sousTotal = ligneDTO.getQuantite() * ligneDTO.getPrixAchat();
                total += sousTotal;

                Double stockActuel = article.getQuantiteStock() != null ? article.getQuantiteStock() : 0.0;
                article.setQuantiteStock(stockActuel + ligneDTO.getQuantite());
                article.setPrixAchat(ligneDTO.getPrixAchat());
                articleRepository.save(article);

                LigneAchat ligneAchat = LigneAchat.builder()
                        .achat(savedAchat)
                        .article(article)
                        .quantite(ligneDTO.getQuantite())
                        .prixAchat(ligneDTO.getPrixAchat())
                        .sousTotal(sousTotal)
                        .build();

                ligneAchatRepository.save(ligneAchat);
            }
        }

        savedAchat.setTotal(total);
        savedAchat.setStatut(StatutAchat.RECEPTIONNE);
        achatRepository.save(savedAchat);

        return mapToDTO(savedAchat);
    }

    @Override
    public List<AchatDTO> afficherAchats() {
        return achatRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AchatDTO chercherParId(Long id) {
        Achat achat = achatRepository.findById(id).orElse(null);
        return mapToDTO(achat);
    }

    @Override
    @Transactional
    public AchatDTO modifierAchat(Long id, AchatDTO achatDTO) {

        Achat achat = achatRepository.findById(id).orElse(null);

        if (achat == null) {
            return null;
        }

        List<LigneAchat> anciennesLignes = ligneAchatRepository.findByAchat_Id(id);

        for (LigneAchat ligne : anciennesLignes) {
            Article article = ligne.getArticle();

            if (article != null) {
                Double stockActuel = article.getQuantiteStock() != null ? article.getQuantiteStock() : 0.0;
                article.setQuantiteStock(stockActuel - ligne.getQuantite());
                articleRepository.save(article);
            }
        }

        ligneAchatRepository.deleteByAchat_Id(id);

        Fournisseur fournisseur = fournisseurRepository
                .findById(achatDTO.getFournisseurId())
                .orElse(null);

        achat.setDateAchat(achatDTO.getDateAchat());
        achat.setFournisseur(fournisseur);
        achat.setStatut(StatutAchat.EN_COURS);

        double total = 0.0;

        for (LigneAchatDTO ligneDTO : achatDTO.getLignes()) {

            Article article = articleRepository.findById(ligneDTO.getArticleId()).orElse(null);

            if (article != null) {
                double sousTotal = ligneDTO.getQuantite() * ligneDTO.getPrixAchat();
                total += sousTotal;

                Double stockActuel = article.getQuantiteStock() != null ? article.getQuantiteStock() : 0.0;
                article.setQuantiteStock(stockActuel + ligneDTO.getQuantite());
                article.setPrixAchat(ligneDTO.getPrixAchat());
                articleRepository.save(article);

                LigneAchat nouvelleLigne = LigneAchat.builder()
                        .achat(achat)
                        .article(article)
                        .quantite(ligneDTO.getQuantite())
                        .prixAchat(ligneDTO.getPrixAchat())
                        .sousTotal(sousTotal)
                        .build();

                ligneAchatRepository.save(nouvelleLigne);
            }
        }

        achat.setTotal(total);
        achat.setStatut(StatutAchat.RECEPTIONNE);
        Achat updatedAchat = achatRepository.save(achat);

        return mapToDTO(updatedAchat);
    }

    @Override
    @Transactional
    public void supprimerAchat(Long id) {
        List<LigneAchat> lignes = ligneAchatRepository.findByAchat_Id(id);

        for (LigneAchat ligne : lignes) {
            Article article = ligne.getArticle();

            if (article != null) {
                Double stockActuel = article.getQuantiteStock() != null ? article.getQuantiteStock() : 0.0;
                article.setQuantiteStock(stockActuel - ligne.getQuantite());
                articleRepository.save(article);
            }
        }

        ligneAchatRepository.deleteByAchat_Id(id);
        achatRepository.deleteById(id);
    }

    private AchatDTO mapToDTO(Achat achat) {
        if (achat == null) {
            return null;
        }

        List<LigneAchatDTO> lignes = ligneAchatRepository.findByAchat_Id(achat.getId())
                .stream()
                .map(ligne -> LigneAchatDTO.builder()
                        .id(ligne.getId())
                        .articleId(ligne.getArticle() != null ? ligne.getArticle().getId() : null)
                        .articleNom(ligne.getArticle() != null ? ligne.getArticle().getNom() : null)
                        .quantite(ligne.getQuantite())
                        .prixAchat(ligne.getPrixAchat())
                        .sousTotal(ligne.getSousTotal())
                        .build())
                .collect(Collectors.toList());

        return AchatDTO.builder()
                .id(achat.getId())
                .dateAchat(achat.getDateAchat())
                .fournisseurId(achat.getFournisseur() != null ? achat.getFournisseur().getId() : null)
                .fournisseurNom(achat.getFournisseur() != null ? achat.getFournisseur().getNom() : null)
                .total(achat.getTotal())
                .lignes(lignes)
                .build();
    }
}
