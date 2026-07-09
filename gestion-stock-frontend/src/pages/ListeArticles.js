import React, { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import { Link } from "react-router-dom";

function ListeArticles() {
    const [articles, setArticles] = useState([]);
    const [recherche, setRecherche] = useState("");
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        chargerArticles();
    }, []);

    const chargerArticles = () => {
        api.get("/articles")
            .then(response => setArticles(response.data))
            .catch(error => setErreur(getErrorMessage(error, "Impossible de charger les articles.")));
    };

    const supprimerArticle = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
            api.delete(`/articles/${id}`)
                .then(() => chargerArticles())
                .catch(error => setErreur(getErrorMessage(error, "Impossible de supprimer l'article.")));
        }
    };

    const articlesFiltres = articles.filter(article =>
        (article.nom || "").toLowerCase().includes(recherche.toLowerCase()) ||
        (article.description || "").toLowerCase().includes(recherche.toLowerCase()) ||
        (article.codeBarres || "").toLowerCase().includes(recherche.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <div className="card shadow border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3>Gestion des articles</h3>

                    <Link to="/ajouter-article" className="btn btn-light">
                        + Ajouter un article
                    </Link>
                </div>

                <div className="card-body">
                    {erreur && <div className="alert alert-danger">{erreur}</div>}
                    <input
                        type="text"
                        className="form-control mb-4"
                        placeholder="Rechercher par nom, description ou code-barres..."
                        value={recherche}
                        onChange={(e) => setRecherche(e.target.value)}
                    />

                    <table className="table table-hover table-bordered align-middle">
                        <thead className="table-dark">
                        <tr>
                            <th>Identifiant</th>
                            <th>Nom</th>
                            <th>Description</th>
                            <th>Code-barres</th>
                            <th>Prix d'achat</th>
                            <th>Prix de vente</th>
                            <th>Stock</th>
                            <th>État</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {articlesFiltres.length > 0 ? (
                            articlesFiltres.map(article => (
                                <tr key={article.id}>
                                    <td>{article.id}</td>
                                    <td>{article.nom}</td>
                                    <td>{article.description}</td>
                                    <td>{article.codeBarres}</td>
                                    <td>{article.prixAchat} DT</td>
                                    <td>{article.prixVente} DT</td>
                                    <td>{article.quantiteStock}</td>
                                    <td>
                                        {article.quantiteStock <= article.seuilStock ? (
                                            <span className="badge bg-danger">Stock faible</span>
                                        ) : (
                                            <span className="badge bg-success">Disponible</span>
                                        )}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/modifier-article/${article.id}`}
                                            className="btn btn-warning btn-sm me-2"
                                        >
                                            Modifier
                                        </Link>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => supprimerArticle(article.id)}
                                        >
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center text-muted">
                                    Aucun article trouvé
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ListeArticles;
