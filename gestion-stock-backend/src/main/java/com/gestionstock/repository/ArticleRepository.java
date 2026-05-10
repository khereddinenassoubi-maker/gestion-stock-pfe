package com.gestionstock.repository;

import com.gestionstock.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArticleRepository extends JpaRepository<Article, Long> {

    Optional<Article> findByCodeBarres(String codeBarres);

}
