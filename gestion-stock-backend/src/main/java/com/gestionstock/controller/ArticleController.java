package com.gestionstock.controller;

import com.gestionstock.entity.Article;
import com.gestionstock.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    public Article ajouter(@RequestBody Article article) {
        return articleService.ajouterArticle(article);
    }

    @GetMapping
    public List<Article> afficher() {
        return articleService.afficherArticles();
    }

    @GetMapping("/{id}")
    public Article chercherParId(@PathVariable Long id) {
        return articleService.chercherParId(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Article modifier(@PathVariable Long id, @RequestBody Article article) {
        Article ancienArticle = articleService.chercherParId(id).orElse(null);

        if (ancienArticle != null) {
            ancienArticle.setNom(article.getNom());
            ancienArticle.setDescription(article.getDescription());
            ancienArticle.setCodeBarres(article.getCodeBarres());
            ancienArticle.setPrixAchat(article.getPrixAchat());
            ancienArticle.setPrixVente(article.getPrixVente());
            ancienArticle.setQuantiteStock(article.getQuantiteStock());
            ancienArticle.setSeuilStock(article.getSeuilStock());
            ancienArticle.setActif(article.getActif());

            return articleService.ajouterArticle(ancienArticle);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public void supprimer(@PathVariable Long id) {
        articleService.supprimerArticle(id);
    }
}