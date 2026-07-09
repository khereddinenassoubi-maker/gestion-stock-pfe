package com.gestionstock.controller;

import com.gestionstock.entity.Article;
import com.gestionstock.service.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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
        return articleService.chercherParId(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Article introuvable."));
    }

    @PutMapping("/{id}")
    public Article modifier(@PathVariable Long id, @RequestBody Article article) {
        return articleService.modifierArticle(id, article);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Long id) {
        articleService.supprimerArticle(id);
    }
}
