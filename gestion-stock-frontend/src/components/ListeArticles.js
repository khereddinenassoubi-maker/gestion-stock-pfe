import React, { useEffect, useState } from "react";
import axios from "axios";

function ListeArticles() {
    const [articles, setArticles] = useState([]);
    const [recherche, setRecherche] = useState("");

    const [nouvelArticle, setNouvelArticle] = useState({
        nom: "",
        description: "",
        codeBarres: "",
        prixAchat: "",
        prixVente: "",
        quantiteStock: "",
        seuilStock: "",
        actif: true
    });

    const [articleModifier, setArticleModifier] = useState(null);

    useEffect(() => {
        chargerArticles();
    }, []);

    const chargerArticles = () => {
        axios.get("http://localhost:8080/api/articles")
            .then(response => setArticles(response.data))
            .catch(error => console.log(error));
    };

    const ajouterArticle = () => {
        axios.post("http://localhost:8080/api/articles", nouvelArticle)
            .then(() => {
                chargerArticles();
                setNouvelArticle({
                    nom: "",
                    description: "",
                    codeBarres: "",
                    prixAchat: "",
                    prixVente: "",
                    quantiteStock: "",
                    seuilStock: "",
                    actif: true
                });
            })
            .catch(error => console.log(error));
    };

    const supprimerArticle = (id) => {
        if (window.confirm("Voulez-vous vraiment supprimer cet article ?")) {
            axios.delete(`http://localhost:8080/api/articles/${id}`)
                .then(() => chargerArticles())
                .catch(error => console.log(error));
        }
    };

    const ouvrirModification = (article) => {
        setArticleModifier({ ...article });
    };

    const modifierArticle = () => {
        axios.put(
            `http://localhost:8080/api/articles/${articleModifier.id}`,
            articleModifier
        )
            .then(() => chargerArticles())
            .catch(error => console.log(error));
    };

    const articlesFiltres = articles.filter(article =>
        (article.nom || "").toLowerCase().includes(recherche.toLowerCase()) ||
        (article.description || "").toLowerCase().includes(recherche.toLowerCase()) ||
        (article.codeBarres || "").toLowerCase().includes(recherche.toLowerCase())
    );

    return (
        <div className="container mt-5">
            <div className="card shadow-lg border-0">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Gestion des articles</h3>

                    <button
                        className="btn btn-light"
                        data-bs-toggle="modal"
                        data-bs-target="#ajoutModal"
                    >
                        + Ajouter un article
                    </button>
                </div>

                <div className="card-body">
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
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modifierModal"
                                            onClick={() => ouvrirModification(article)}
                                        >
                                            Modifier
                                        </button>

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

            <div className="modal fade" id="ajoutModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title">Ajouter un article</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Nom</label>
                                    <input type="text" className="form-control" value={nouvelArticle.nom}
                                           onChange={(e) => setNouvelArticle({ ...nouvelArticle, nom: e.target.value })} />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">Code-barres</label>
                                    <input type="text" className="form-control" value={nouvelArticle.codeBarres}
                                           onChange={(e) => setNouvelArticle({ ...nouvelArticle, codeBarres: e.target.value })} />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Description</label>
                                    <input type="text" className="form-control" value={nouvelArticle.description}
                                           onChange={(e) => setNouvelArticle({ ...nouvelArticle, description: e.target.value })} />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Prix d'achat</label>
                                    <input type="number" className="form-control" value={nouvelArticle.prixAchat}
                                           onChange={(e) => setNouvelArticle({ ...nouvelArticle, prixAchat: e.target.value })} />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Prix de vente</label>
                                    <input type="number" className="form-control" value={nouvelArticle.prixVente}
                                           onChange={(e) => setNouvelArticle({ ...nouvelArticle, prixVente: e.target.value })} />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Quantité en stock</label>
                                    <input type="number" className="form-control" value={nouvelArticle.quantiteStock}
                                           onChange={(e) => setNouvelArticle({ ...nouvelArticle, quantiteStock: e.target.value })} />
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label">Seuil minimum du stock</label>
                                    <input type="number" className="form-control" value={nouvelArticle.seuilStock}
                                           onChange={(e) => setNouvelArticle({ ...nouvelArticle, seuilStock: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button className="btn btn-primary" onClick={ajouterArticle} data-bs-dismiss="modal">Ajouter</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="modifierModal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-warning">
                            <h5 className="modal-title">Modifier un article</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>

                        <div className="modal-body">
                            {articleModifier && (
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">Nom</label>
                                        <input type="text" className="form-control" value={articleModifier.nom || ""}
                                               onChange={(e) => setArticleModifier({ ...articleModifier, nom: e.target.value })} />
                                    </div>

                                    <div className="col-md-6">
                                        <label className="form-label">Code-barres</label>
                                        <input type="text" className="form-control" value={articleModifier.codeBarres || ""}
                                               onChange={(e) => setArticleModifier({ ...articleModifier, codeBarres: e.target.value })} />
                                    </div>

                                    <div className="col-12">
                                        <label className="form-label">Description</label>
                                        <input type="text" className="form-control" value={articleModifier.description || ""}
                                               onChange={(e) => setArticleModifier({ ...articleModifier, description: e.target.value })} />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Prix d'achat</label>
                                        <input type="number" className="form-control" value={articleModifier.prixAchat || ""}
                                               onChange={(e) => setArticleModifier({ ...articleModifier, prixAchat: e.target.value })} />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Prix de vente</label>
                                        <input type="number" className="form-control" value={articleModifier.prixVente || ""}
                                               onChange={(e) => setArticleModifier({ ...articleModifier, prixVente: e.target.value })} />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Quantité en stock</label>
                                        <input type="number" className="form-control" value={articleModifier.quantiteStock || ""}
                                               onChange={(e) => setArticleModifier({ ...articleModifier, quantiteStock: e.target.value })} />
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label">Seuil minimum du stock</label>
                                        <input type="number" className="form-control" value={articleModifier.seuilStock || ""}
                                               onChange={(e) => setArticleModifier({ ...articleModifier, seuilStock: e.target.value })} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                            <button className="btn btn-warning" onClick={modifierArticle} data-bs-dismiss="modal">Enregistrer</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListeArticles;