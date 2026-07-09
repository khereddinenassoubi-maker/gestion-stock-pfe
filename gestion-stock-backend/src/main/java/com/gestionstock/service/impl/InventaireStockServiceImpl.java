package com.gestionstock.service.impl;

import com.gestionstock.dto.InventaireStockDTO;
import com.gestionstock.entity.Article;
import com.gestionstock.entity.InventaireStock;
import com.gestionstock.enums.TypeInventaire;
import com.gestionstock.repository.ArticleRepository;
import com.gestionstock.repository.InventaireStockRepository;
import com.gestionstock.service.InventaireStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventaireStockServiceImpl implements InventaireStockService {

    private final InventaireStockRepository inventaireRepository;
    private final ArticleRepository articleRepository;

    @Override
    public InventaireStockDTO enregistrer(InventaireStockDTO dto) {
        if (dto.getArticleId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Article obligatoire.");
        }
        if (dto.getQuantiteReelle() == null || dto.getQuantiteReelle() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Stock reel invalide.");
        }

        Article article = articleRepository.findById(dto.getArticleId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article introuvable."));

        double avant = valeur(article.getQuantiteStock());
        double reel = valeur(dto.getQuantiteReelle());
        double ecart = reel - avant;
        double valeurEcart = Math.abs(ecart) * valeur(article.getPrixAchat());

        article.setQuantiteStock(reel);
        articleRepository.save(article);

        InventaireStock operation = inventaireRepository.save(InventaireStock.builder()
                .article(article)
                .dateOperation(LocalDateTime.now())
                .type(type(dto.getType(), ecart))
                .quantiteAvant(avant)
                .quantiteReelle(reel)
                .ecart(ecart)
                .valeurEcart(valeurEcart)
                .motif(dto.getMotif())
                .utilisateurNom(dto.getUtilisateurNom())
                .build());

        return mapper(operation);
    }

    @Override
    public List<InventaireStockDTO> afficher() {
        return inventaireRepository.findAll().stream()
                .sorted((a, b) -> b.getDateOperation().compareTo(a.getDateOperation()))
                .map(this::mapper)
                .toList();
    }

    private TypeInventaire type(String type, double ecart) {
        if (type != null) {
            try {
                return TypeInventaire.valueOf(type);
            } catch (IllegalArgumentException ignored) {
                // choix automatique ci-dessous
            }
        }
        return ecart < 0 ? TypeInventaire.PERTE : TypeInventaire.REGULARISATION;
    }

    private InventaireStockDTO mapper(InventaireStock operation) {
        Article article = operation.getArticle();
        return InventaireStockDTO.builder()
                .id(operation.getId())
                .articleId(article != null ? article.getId() : null)
                .articleNom(article != null ? article.getNom() : "Article supprime")
                .dateOperation(operation.getDateOperation())
                .type(operation.getType() != null ? operation.getType().name() : null)
                .quantiteAvant(operation.getQuantiteAvant())
                .quantiteReelle(operation.getQuantiteReelle())
                .ecart(operation.getEcart())
                .valeurEcart(operation.getValeurEcart())
                .motif(operation.getMotif())
                .utilisateurNom(operation.getUtilisateurNom())
                .build();
    }

    private double valeur(Double valeur) {
        return valeur == null ? 0.0 : valeur;
    }
}
