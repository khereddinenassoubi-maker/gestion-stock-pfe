import React, { useEffect, useMemo, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function Stock() {
    const [articles, setArticles] = useState([]);
    const [ventes, setVentes] = useState([]);
    const [dateGain, setDateGain] = useState(new Date().toISOString().slice(0, 10));
    const [recherche, setRecherche] = useState("");
    const [erreur, setErreur] = useState("");

    const charger = async () => {
        try {
            setErreur("");
            const [articlesResponse, ventesResponse] = await Promise.all([
                api.get("/articles"),
                api.get("/ventes")
            ]);
            setArticles(articlesResponse.data || []);
            setVentes(ventesResponse.data || []);
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de charger le stock."));
        }
    };

    useEffect(() => {
        charger();
    }, []);

    const articlesFiltres = useMemo(() => {
        const mot = recherche.toLowerCase();
        return articles.filter(article =>
            (article.nom || "").toLowerCase().includes(mot) ||
            (article.codeBarres || "").toLowerCase().includes(mot) ||
            (article.categorieNom || "").toLowerCase().includes(mot)
        );
    }, [articles, recherche]);

    const statsJour = useMemo(() => {
        const parArticle = {};
        ventes
            .filter(vente => vente.dateVente === dateGain)
            .filter(vente => vente.statut !== "ANNULEE")
            .forEach(vente => {
                (vente.lignes || []).forEach(ligne => {
                    const article = articles.find(a => Number(a.id) === Number(ligne.articleId));
                    const prixAchat = Number(article?.prixAchat || 0);
                    const prixVente = Number(ligne.prixVente || 0);
                    const quantite = Number(ligne.quantite || 0);
                    const gain = (prixVente - prixAchat) * quantite;
                    const id = ligne.articleId || ligne.articleNom;
                    parArticle[id] = parArticle[id] || {
                        articleNom: ligne.articleNom,
                        quantite: 0,
                        chiffreAffaires: 0,
                        gain: 0
                    };
                    parArticle[id].quantite += quantite;
                    parArticle[id].chiffreAffaires += prixVente * quantite;
                    parArticle[id].gain += gain;
                });
            });
        return Object.values(parArticle).sort((a, b) => b.gain - a.gain);
    }, [articles, ventes, dateGain]);

    const totalValeurAchat = articlesFiltres.reduce((sum, article) =>
        sum + Number(article.prixAchat || 0) * Number(article.quantiteStock || 0), 0);

    const totalValeurVente = articlesFiltres.reduce((sum, article) =>
        sum + Number(article.prixVente || 0) * Number(article.quantiteStock || 0), 0);

    const totalMargeStock = totalValeurVente - totalValeurAchat;
    const gainJour = statsJour.reduce((sum, item) => sum + item.gain, 0);

    const montant = valeur => Number(valeur || 0).toLocaleString("fr-FR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    });

    return (
        <div className="container mt-4">
            <div className="card shadow border-0 mb-4">
                <div className="card-header bg-primary text-white">
                    <h3>Stock</h3>
                </div>
                <div className="card-body">
                    {erreur && <div className="alert alert-danger">{erreur}</div>}

                    <div className="row mb-3">
                        <div className="col-md-3">
                            <div className="border rounded p-3 bg-white">Valeur achat : {montant(totalValeurAchat)} DT</div>
                        </div>
                        <div className="col-md-3">
                            <div className="border rounded p-3 bg-white">Valeur vente : {montant(totalValeurVente)} DT</div>
                        </div>
                        <div className="col-md-3">
                            <div className="border rounded p-3 bg-white">Marge stock : {montant(totalMargeStock)} DT</div>
                        </div>
                        <div className="col-md-3">
                            <div className="border rounded p-3 bg-white">Gain du jour : {montant(gainJour)} DT</div>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-8">
                            <input
                                className="form-control"
                                placeholder="Rechercher article, code-barres ou categorie"
                                value={recherche}
                                onChange={e => setRecherche(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <input
                                type="date"
                                className="form-control"
                                value={dateGain}
                                onChange={e => setDateGain(e.target.value)}
                            />
                        </div>
                    </div>

                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                        <tr>
                            <th>Article</th>
                            <th>Code-barres</th>
                            <th>Categorie</th>
                            <th>Stock</th>
                            <th>Prix achat</th>
                            <th>Prix vente</th>
                            <th>Marge unite</th>
                            <th>Valeur stock</th>
                            <th>Marge stock</th>
                            <th>Etat</th>
                        </tr>
                        </thead>
                        <tbody>
                        {articlesFiltres.map(article => {
                            const stock = Number(article.quantiteStock || 0);
                            const prixAchat = Number(article.prixAchat || 0);
                            const prixVente = Number(article.prixVente || 0);
                            const margeUnite = prixVente - prixAchat;
                            const margeStock = margeUnite * stock;
                            return (
                                <tr key={article.id}>
                                    <td>{article.nom}</td>
                                    <td>{article.codeBarres || "-"}</td>
                                    <td>{article.categorieNom || "-"}</td>
                                    <td>{stock}</td>
                                    <td>{montant(prixAchat)} DT</td>
                                    <td>{montant(prixVente)} DT</td>
                                    <td>{montant(margeUnite)} DT</td>
                                    <td>{montant(prixAchat * stock)} DT</td>
                                    <td>{montant(margeStock)} DT</td>
                                    <td>
                                        {stock <= Number(article.seuilStock || 0) ? (
                                            <span className="badge bg-danger">Faible</span>
                                        ) : (
                                            <span className="badge bg-success">Disponible</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="card shadow border-0">
                <div className="card-header bg-dark text-white">
                    <h4>Marge realisee par jour</h4>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                        <tr>
                            <th>Article</th>
                            <th>Quantite vendue</th>
                            <th>Chiffre affaires</th>
                            <th>Gain</th>
                        </tr>
                        </thead>
                        <tbody>
                        {statsJour.map(item => (
                            <tr key={item.articleNom}>
                                <td>{item.articleNom}</td>
                                <td>{item.quantite}</td>
                                <td>{montant(item.chiffreAffaires)} DT</td>
                                <td>{montant(item.gain)} DT</td>
                            </tr>
                        ))}
                        {statsJour.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center text-muted">Aucune vente pour cette date.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Stock;
