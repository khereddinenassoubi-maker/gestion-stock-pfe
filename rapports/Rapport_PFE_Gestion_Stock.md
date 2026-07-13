# Rapport de Projet de Fin d'Etudes

## Titre du projet

Conception et réalisation d'une application web de gestion de stock, achats, ventes, caisse et crédits clients

## Informations du projet

- Réalisé par : Khereddine Nassoubi et Hamza Jaliliya
- Encadrant : Walid Hammami
- Etablissement : à compléter selon l'exemple fourni
- Filière : à compléter
- Année universitaire : 2025 / 2026

---

# Remerciements

Nous tenons à remercier toutes les personnes qui ont contribué à la réalisation de ce projet de fin d'études. Nos remerciements s'adressent particulièrement à notre encadrant, Monsieur Walid Hammami, pour son suivi, ses conseils et ses orientations durant toutes les étapes du projet.

Nous remercions également les enseignants et le personnel de l'établissement pour la formation reçue, ainsi que nos familles et nos proches pour leur soutien moral.

---

# Résumé

Ce projet consiste à concevoir et développer une application web de gestion de stock destinée à faciliter le suivi des articles, des achats, des ventes, des clients, des fournisseurs, des crédits clients, des caisses et de l'inventaire.

L'application permet à l'administrateur de gérer les articles, les catégories, les fournisseurs, les utilisateurs, les autorisations, l'inventaire et les statistiques. Elle permet également au caissier d'effectuer les opérations courantes telles que les ventes, les achats, la gestion de caisse et le suivi des clients.

La solution est développée sous forme d'une architecture web composée d'un frontend React et d'un backend Spring Boot connecté à une base de données MySQL. Elle respecte une conception orientée objet basée sur des entités telles que Utilisateur, Administrateur, Caissier, Article, Achat, Vente, Client, Fournisseur, Paiement et CréditClient.

Mots-clés : gestion de stock, Spring Boot, React, MySQL, caisse, vente, achat, inventaire, crédit client.

---

# Abstract

This project aims to design and develop a web-based stock management application. The system manages products, purchases, sales, customers, suppliers, customer credits, cash sessions and inventory operations.

The administrator can manage products, categories, suppliers, users, permissions, inventory and statistics. The cashier can perform operational tasks such as sales, purchases, cash opening and closing, and customer follow-up.

The application is based on a React frontend, a Spring Boot backend and a MySQL database. The design follows an object-oriented model including entities such as User, Administrator, Cashier, Product, Purchase, Sale, Customer, Supplier, Payment and CustomerCredit.

Keywords: stock management, Spring Boot, React, MySQL, cashier, sale, purchase, inventory, customer credit.

---

# Table des matières proposée

1. Introduction générale
2. Présentation du projet
3. Analyse et spécification des besoins
4. Conception du système
5. Réalisation de l'application
6. Tests et validation
7. Conclusion générale et perspectives

---

# Chapitre 1 : Introduction générale

## 1.1 Contexte du projet

La gestion de stock est une activité essentielle pour toute entreprise commerciale. Elle permet de suivre les entrées et sorties des articles, de contrôler les quantités disponibles, de gérer les achats auprès des fournisseurs et les ventes aux clients.

Dans de nombreuses petites structures, ces opérations sont encore réalisées manuellement ou à l'aide de fichiers simples. Cette méthode peut provoquer des erreurs de calcul, des pertes d'informations, des difficultés de suivi des crédits clients et une absence de statistiques fiables.

Le présent projet vise à développer une application web permettant d'automatiser ces tâches et d'offrir une vision claire sur l'état du stock, les ventes, les achats, la caisse et les crédits.

## 1.2 Problématique

La gestion manuelle du stock pose plusieurs problèmes :

- difficulté de connaître le stock disponible en temps réel ;
- risque d'erreur lors de la saisie des ventes et des achats ;
- absence de suivi précis des crédits clients ;
- manque de contrôle sur la caisse journalière ;
- difficulté de détecter les pertes et les écarts de stock ;
- absence de statistiques sur les gains, les recettes et les articles les plus vendus.

## 1.3 Objectifs du projet

L'objectif principal est de réaliser une application web complète pour la gestion de stock. Les objectifs spécifiques sont :

- gérer les articles et les catégories ;
- gérer les fournisseurs et les achats ;
- gérer les ventes en espèces et à crédit ;
- gérer les clients et les avances clients ;
- suivre les crédits clients ;
- gérer la caisse par caissier avec ouverture et clôture ;
- gérer l'inventaire et les pertes de stock ;
- fournir un tableau de bord statistique ;
- respecter les rôles Administrateur et Caissier.

## 1.4 Méthodologie adoptée

Le projet a été réalisé selon une démarche progressive :

1. analyse des besoins ;
2. conception des entités et des relations ;
3. développement du backend ;
4. développement du frontend ;
5. intégration avec la base de données ;
6. tests des fonctionnalités ;
7. amélioration de l'interface utilisateur.

---

# Chapitre 2 : Présentation du projet

## 2.1 Description générale

L'application développée est une solution web de gestion de stock. Elle permet à l'utilisateur de gérer les opérations principales d'un commerce :

- articles ;
- catégories ;
- fournisseurs ;
- achats ;
- ventes ;
- clients ;
- crédits clients ;
- caisse ;
- inventaire ;
- utilisateurs ;
- statistiques.

## 2.2 Acteurs du système

Le système contient deux acteurs principaux.

### Administrateur

L'administrateur possède tous les droits. Il peut :

- gérer les articles ;
- gérer les catégories ;
- gérer les fournisseurs ;
- gérer les clients ;
- gérer les achats ;
- gérer les ventes ;
- gérer les caissiers ;
- gérer l'inventaire ;
- consulter les statistiques ;
- suivre les crédits et les caisses.

### Caissier

Le caissier possède un accès limité. Il peut :

- effectuer les ventes ;
- effectuer les achats selon l'autorisation prévue ;
- gérer la caisse ;
- consulter les clients et crédits nécessaires à la vente.

## 2.3 Fonctionnalités principales

### Gestion des articles

Chaque article possède un nom, une description, un code-barres, un prix d'achat, un prix de vente, une quantité en stock, un seuil de stock et une catégorie.

### Gestion des achats

Le module achat permet d'enregistrer les factures d'achat, de choisir un fournisseur, d'ajouter plusieurs lignes d'achat et d'augmenter automatiquement le stock.

### Gestion des ventes

Le module vente permet de saisir une vente en espèces ou à crédit. La vente peut être effectuée pour un client passager ou un client enregistré. Le stock est diminué automatiquement après la vente.

### Gestion des crédits clients

Lorsqu'une vente est enregistrée à crédit, le montant restant est associé au client. L'application permet ensuite d'enregistrer une avance ou un règlement.

### Gestion de la caisse

Le module caisse permet au caissier d'ouvrir une caisse, de la clôturer et de suivre les montants d'espèces, de crédit et les écarts.

### Gestion de l'inventaire

Le module inventaire est réservé à l'administrateur. Il permet d'initialiser le stock, de régulariser les quantités réelles et de suivre les pertes avec leur valeur.

### Tableau de bord

Le tableau de bord affiche les indicateurs importants : recettes, crédits, stock disponible, stock faible, ventes annulées, gain par article, gain par catégorie et suivi par période.

---

# Chapitre 3 : Analyse et spécification des besoins

## 3.1 Besoins fonctionnels

Le système doit permettre :

- l'authentification simplifiée par rôle ;
- la gestion des utilisateurs ;
- la gestion des articles ;
- la gestion des catégories ;
- la gestion des fournisseurs ;
- la saisie des achats ;
- la saisie des ventes ;
- la gestion du paiement en espèces ;
- la gestion du paiement à crédit ;
- la gestion des avances clients ;
- l'ouverture et la clôture de caisse ;
- la régularisation du stock par inventaire ;
- la consultation des statistiques.

## 3.2 Besoins non fonctionnels

L'application doit être :

- simple à utiliser ;
- rapide lors de la saisie ;
- adaptée au lecteur code-barres ;
- sécurisée par séparation des rôles ;
- évolutive ;
- connectée à une base de données fiable ;
- compatible avec un environnement local utilisant XAMPP et MySQL.

## 3.3 Règles de gestion

- Un administrateur possède toutes les autorisations.
- Un caissier possède un accès limité aux opérations nécessaires.
- Une vente en espèces génère un paiement.
- Une vente à crédit génère un crédit client.
- Une vente diminue le stock.
- Un achat augmente le stock.
- L'inventaire est réservé à l'administrateur.
- Une caisse est liée à un caissier et possède une date d'ouverture et une date de clôture.
- Les pertes de stock sont calculées selon l'écart entre le stock système et le stock réel.

---

# Chapitre 4 : Conception du système

## 4.1 Architecture générale

L'application est basée sur une architecture client-serveur :

- Frontend : React JS ;
- Backend : Spring Boot ;
- Base de données : MySQL ;
- Communication : API REST ;
- Gestion des dépendances backend : Maven ;
- Environnement base de données : XAMPP.

## 4.2 Diagramme de classes

Le système repose sur les classes principales suivantes :

- Utilisateur ;
- Administrateur ;
- Caissier ;
- Article ;
- Catégorie ;
- Achat ;
- LigneAchat ;
- Vente ;
- LigneVente ;
- Client ;
- Fournisseur ;
- Paiement ;
- CreditClient ;
- CaisseSession ;
- InventaireStock.

## 4.3 Description des entités

### Utilisateur

Représente un utilisateur du système. Il contient les informations d'identification, le rôle et l'état actif.

### Administrateur

Hérite de Utilisateur. Il possède les droits complets de gestion.

### Caissier

Hérite de Utilisateur. Il effectue les opérations de caisse, ventes et achats autorisés.

### Article

Représente un produit stocké. Il contient le code-barres, les prix, la quantité en stock et la catégorie.

### Achat et LigneAchat

Un achat représente une facture fournisseur. Chaque achat contient plusieurs lignes d'achat.

### Vente et LigneVente

Une vente représente une facture client. Chaque vente contient plusieurs lignes de vente.

### Paiement

Représente le règlement d'une vente en espèces.

### CreditClient

Représente une dette client issue d'une vente à crédit.

### CaisseSession

Représente l'ouverture et la clôture d'une caisse par un caissier.

### InventaireStock

Représente une opération d'inventaire, de régularisation ou de perte.

---

# Chapitre 5 : Réalisation de l'application

## 5.1 Environnement de développement

Le projet a été développé avec les outils suivants :

- IntelliJ IDEA pour le backend ;
- Visual Studio Code ou environnement React pour le frontend ;
- XAMPP pour MySQL ;
- Spring Boot ;
- React JS ;
- Bootstrap ;
- Axios ;
- Maven.

## 5.2 Réalisation du backend

Le backend est développé avec Spring Boot. Il contient :

- les entités JPA ;
- les repositories ;
- les services métiers ;
- les contrôleurs REST ;
- les DTO pour l'échange des données.

Les API REST permettent au frontend de communiquer avec la base de données.

## 5.3 Réalisation du frontend

Le frontend est développé avec React. Il contient plusieurs pages :

- Dashboard ;
- Articles ;
- Catégories ;
- Achats ;
- Ventes ;
- Clients ;
- Fournisseurs ;
- Caisse ;
- Inventaire ;
- Administration.

L'interface est conçue pour faciliter la saisie rapide par l'utilisateur et limiter les erreurs.

## 5.4 Base de données

La base de données MySQL contient les tables correspondant aux entités du système. Les relations permettent de suivre :

- les lignes d'achat liées aux achats ;
- les lignes de vente liées aux ventes ;
- les ventes liées aux clients ;
- les crédits liés aux clients ;
- les paiements liés aux ventes ;
- les opérations d'inventaire liées aux articles.

---

# Chapitre 6 : Tests et validation

## 6.1 Tests réalisés

Les tests effectués concernent :

- ajout d'un article ;
- modification d'un article ;
- création d'une facture d'achat ;
- création d'une facture de vente ;
- vente en espèces ;
- vente à crédit ;
- règlement d'un crédit client ;
- ouverture de caisse ;
- clôture de caisse ;
- régularisation de stock par inventaire ;
- affichage des statistiques.

## 6.2 Résultats

Les tests montrent que l'application permet de gérer les principales opérations d'un système de gestion de stock. Les modules sont reliés entre eux : les achats augmentent le stock, les ventes diminuent le stock, les crédits sont associés aux clients et la caisse permet de suivre les recettes.

---

# Chapitre 7 : Conclusion générale et perspectives

## 7.1 Conclusion

Ce projet a permis de concevoir et réaliser une application web complète de gestion de stock. La solution répond aux besoins principaux d'un commerce : gestion des articles, achats, ventes, clients, fournisseurs, crédits, caisse et inventaire.

L'application facilite le travail de l'utilisateur, réduit les erreurs de saisie et fournit des statistiques utiles pour le suivi de l'activité.

## 7.2 Perspectives

Plusieurs améliorations peuvent être envisagées :

- ajouter une authentification sécurisée avec mot de passe chiffré ;
- générer automatiquement les factures en PDF ;
- ajouter l'impression des tickets de vente ;
- ajouter une gestion avancée des permissions côté backend ;
- ajouter des graphiques plus détaillés ;
- ajouter une sauvegarde automatique de la base de données ;
- ajouter une version mobile.

---

# Annexes proposées

- Captures d'écran de l'application.
- Diagramme de classes.
- Diagramme de cas d'utilisation.
- Modèle relationnel.
- Exemples de factures de vente et d'achat.
- Exemples de tableaux de bord.
