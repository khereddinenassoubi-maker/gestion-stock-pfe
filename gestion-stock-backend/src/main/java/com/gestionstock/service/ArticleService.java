package com.gestionstock.service;

import com.gestionstock.entity.Article;
import com.gestionstock.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    // Ajouter article
    public Article ajouterArticle(Article article) {
        valider(article);

        if (article.getCodeBarres() == null || article.getCodeBarres().trim().isEmpty()) {
            article.setCodeBarres(genererCodeBarres());
        }

        return articleRepository.save(article);
    }

    private String genererCodeBarres() {
        return "ART" + System.currentTimeMillis();
    }


    // Afficher tous les articles
    public List<Article> afficherArticles() {
        return articleRepository.findAll();
    }

    // Chercher par id
    public Optional<Article> chercherParId(Long id) {
        return articleRepository.findById(id);
    }

    // Chercher par code-barres
    public Optional<Article> chercherParCodeBarres(String codeBarres) {
        return articleRepository.findByCodeBarres(codeBarres);
    }

    public Article modifierArticle(Long id, Article article) {
        Article ancien = articleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article introuvable."));
        valider(article);
        ancien.setNom(article.getNom().trim());
        ancien.setDescription(article.getDescription());
        ancien.setCodeBarres(article.getCodeBarres() == null || article.getCodeBarres().isBlank()
                ? ancien.getCodeBarres() : article.getCodeBarres().trim());
        ancien.setPrixAchat(article.getPrixAchat());
        ancien.setPrixVente(article.getPrixVente());
        ancien.setQuantiteStock(article.getQuantiteStock());
        ancien.setSeuilStock(article.getSeuilStock());
        ancien.setActif(article.getActif() != null ? article.getActif() : true);
        ancien.setCategorie(article.getCategorie());
        return articleRepository.save(ancien);
    }

    // Supprimer article
    public void supprimerArticle(Long id) {
        if (!articleRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Article introuvable.");
        }
        articleRepository.deleteById(id);
    }

    private void valider(Article article) {
        if (article.getNom() == null || article.getNom().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le nom est obligatoire.");
        }
        if (negatif(article.getPrixAchat()) || negatif(article.getPrixVente())
                || negatif(article.getQuantiteStock()) || negatif(article.getSeuilStock())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Les valeurs ne peuvent pas être négatives.");
        }
        if (article.getPrixAchat() != null && article.getPrixVente() != null
                && article.getPrixVente() <= article.getPrixAchat()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Le prix de vente doit être supérieur au prix d'achat.");
        }
        article.setNom(article.getNom().trim());
        article.setPrixAchat(article.getPrixAchat() == null ? 0.0 : article.getPrixAchat());
        article.setPrixVente(article.getPrixVente() == null ? 0.0 : article.getPrixVente());
        article.setQuantiteStock(article.getQuantiteStock() == null ? 0.0 : article.getQuantiteStock());
        article.setSeuilStock(article.getSeuilStock() == null ? 0.0 : article.getSeuilStock());
    }

    private boolean negatif(Double valeur) {
        return valeur != null && valeur < 0;
    }
}
