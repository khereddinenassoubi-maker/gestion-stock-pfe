

import React, { useEffect, useState } from "react";
import axios from "axios";

function Achats() {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [articles, setArticles] = useState([]);
    const [achats, setAchats] = useState([]);

    const [fournisseurId, setFournisseurId] = useState("");
    const [dateAchat, setDateAchat] = useState("");
    const [lignes, setLignes] = useState([
        { articleId: "", quantite: 1, prixAchat: 0 }
    ]);

    useEffect(() => {
        chargerDonnees();
    }, []);

    const chargerDonnees = async () => {
        const resFournisseurs = await axios.get("http://localhost:8080/api/fournisseurs");
        const resArticles = await axios.get("http://localhost:8080/api/articles");
        const resAchats = await axios.get("http://localhost:8080/api/achats");

        setFournisseurs(resFournisseurs.data);
        setArticles(resArticles.data);
        setAchats(resAchats.data);
    };

    const ajouterLigne = () => {
        setLignes([...lignes, { articleId: "", quantite: 1, prixAchat: 0 }]);
    };

    const modifierLigne = (index, champ, valeur) => {
        const nouvellesLignes = [...lignes];
        nouvellesLignes[index][champ] = valeur;
        setLignes(nouvellesLignes);
    };

    const supprimerLigne = (index) => {
        const nouvellesLignes = lignes.filter((_, i) => i !== index);
        setLignes(nouvellesLignes);
    };

    const calculerTotal = () => {
        return lignes.reduce((total, ligne) => {
            return total + Number(ligne.quantite || 0) * Number(ligne.prixAchat || 0);
        }, 0);
    };

    const enregistrerAchat = async () => {
        const achat = {
            dateAchat,
            fournisseurId: Number(fournisseurId),
            lignes: lignes.map((ligne) => ({
                articleId: Number(ligne.articleId),
                quantite: Number(ligne.quantite),
                prixAchat: Number(ligne.prixAchat)
            }))
        };

        await axios.post("http://localhost:8080/api/achats", achat);

        setFournisseurId("");
        setDateAchat("");
        setLignes([{ articleId: "", quantite: 1, prixAchat: 0 }]);

        chargerDonnees();
    };

    const supprimerAchat = async (id) => {
        await axios.delete(`http://localhost:8080/api/achats/${id}`);
        chargerDonnees();
    };

    return (
        <div className="container mt-4">
            <div className="card shadow mb-4">
                <div className="card-header bg-info text-white">
                    <h3>Nouvelle facture d'achat</h3>
                </div>

                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col">
                            <label>Fournisseur</label>
                            <select
                                className="form-control"
                                value={fournisseurId}
                                onChange={(e) => setFournisseurId(e.target.value)}
                            >
                                <option value="">-- Choisir un fournisseur --</option>
                                {fournisseurs.map((fournisseur) => (
                                    <option key={fournisseur.id} value={fournisseur.id}>
                                        {fournisseur.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col">
                            <label>Date d'achat</label>
                            <input
                                type="date"
                                className="form-control"
                                value={dateAchat}
                                onChange={(e) => setDateAchat(e.target.value)}
                            />
                        </div>
                    </div>

                    <table className="table table-bordered">
                        <thead className="table-dark">
                        <tr>
                            <th>Article</th>
                            <th>Quantité</th>
                            <th>Prix Achat</th>
                            <th>Sous-total</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {lignes.map((ligne, index) => (
                            <tr key={index}>
                                <td>
                                    <select
                                        className="form-control"
                                        value={ligne.articleId}
                                        onChange={(e) =>
                                            modifierLigne(index, "articleId", e.target.value)
                                        }
                                    >
                                        <option value="">-- Article --</option>
                                        {articles.map((article) => (
                                            <option key={article.id} value={article.id}>
                                                {article.nom}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={ligne.quantite}
                                        onChange={(e) =>
                                            modifierLigne(index, "quantite", e.target.value)
                                        }
                                    />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={ligne.prixAchat}
                                        onChange={(e) =>
                                            modifierLigne(index, "prixAchat", e.target.value)
                                        }
                                    />
                                </td>

                                <td>
                                    {Number(ligne.quantite || 0) * Number(ligne.prixAchat || 0)}
                                </td>

                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => supprimerLigne(index)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <button className="btn btn-secondary mb-3" onClick={ajouterLigne}>
                        + Ajouter une ligne
                    </button>

                    <h4>Total : {calculerTotal()} DT</h4>

                    <button className="btn btn-info text-white mt-3" onClick={enregistrerAchat}>
                        Enregistrer l'achat
                    </button>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-header bg-dark text-white">
                    <h4>Liste des achats</h4>
                </div>

                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Fournisseur</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {achats.map((achat) => (
                            <tr key={achat.id}>
                                <td>{achat.id}</td>
                                <td>{achat.dateAchat}</td>
                                <td>{achat.fournisseurNom}</td>
                                <td>{achat.total}</td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => supprimerAchat(achat.id)}
                                    >
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Achats;