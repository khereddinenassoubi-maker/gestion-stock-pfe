import React, { useState } from "react";
import axios from "axios";

function AjouterArticle() {

    const [article, setArticle] = useState({
        nom: "",
        description: "",
        codeBarres: "",
        prixAchat: "",
        prixVente: "",
        quantiteStock: "",
        seuilStock: "",
        actif: true
    });

    const changerValeur = (e) => {

        setArticle({
            ...article,
            [e.target.name]: e.target.value
        });
    };

    const ajouterArticle = (e) => {

        e.preventDefault();

        axios.post(
            "http://localhost:8080/api/articles",
            article
        )

            .then(() => {

                alert("Article ajouté avec succès");

                setArticle({
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

            .catch(error => {
                console.log(error);
            });
    };

    return (

        <div className="container mt-4">

            <div className="card shadow border-0">

                <div className="card-header bg-primary text-white">
                    <h3>Ajouter un article</h3>
                </div>

                <div className="card-body">

                    <form onSubmit={ajouterArticle}>

                        <div className="row">

                            <div className="col-md-6 mb-3">
                                <label>Nom</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="nom"
                                    value={article.nom}
                                    onChange={changerValeur}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Description</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="description"
                                    value={article.description}
                                    onChange={changerValeur}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Code-barres</label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="codeBarres"
                                    value={article.codeBarres}
                                    onChange={changerValeur}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Prix d'achat</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="prixAchat"
                                    value={article.prixAchat}
                                    onChange={changerValeur}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Prix de vente</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="prixVente"
                                    value={article.prixVente}
                                    onChange={changerValeur}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Quantité stock</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="quantiteStock"
                                    value={article.quantiteStock}
                                    onChange={changerValeur}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label>Seuil stock</label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="seuilStock"
                                    value={article.seuilStock}
                                    onChange={changerValeur}
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            Enregistrer
                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default AjouterArticle;