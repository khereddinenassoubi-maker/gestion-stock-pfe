package com.gestionstock.service;

import com.gestionstock.entity.Article;
import com.gestionstock.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticleService {

    private final ArticleRepository articleRepository;

    // Ajouter article
    public Article ajouterArticle(Article article) {

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

    // Supprimer article
    public void supprimerArticle(Long id) {
        articleRepository.deleteById(id);
    }
}