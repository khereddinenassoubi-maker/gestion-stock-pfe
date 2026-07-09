import React, { useEffect, useMemo, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function Inventaire() {
    const [articles, setArticles] = useState([]);
    const [operations, setOperations] = useState([]);
    const [form, setForm] = useState({
        articleId: "",
        quantiteReelle: "",
        type: "REGULARISATION",
        motif: ""
    });
    const [erreur, setErreur] = useState("");
    const [message, setMessage] = useState("");

    const charger = async () => {
        try {
            setErreur("");
            const [articlesResponse, inventaireResponse] = await Promise.all([
                api.get("/articles"),
                api.get("/inventaires")
            ]);
            setArticles(articlesResponse.data || []);
            setOperations(inventaireResponse.data || []);
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de charger l'inventaire."));
        }
    };

    useEffect(() => {
        charger();
    }, []);

    const articleSelectionne = useMemo(
        () => articles.find(article => String(article.id) === String(form.articleId)),
        [articles, form.articleId]
    );

    const ecart = articleSelectionne && form.quantiteReelle !== ""
        ? Number(form.quantiteReelle) - Number(articleSelectionne.quantiteStock || 0)
        : 0;

    const valeurEcart = articleSelectionne
        ? Math.abs(ecart) * Number(articleSelectionne.prixAchat || 0)
        : 0;

    const enregistrer = async () => {
        setErreur("");
        setMessage("");
        if (!form.articleId) {
            setErreur("Choisir un article.");
            return;
        }
        if (form.quantiteReelle === "" || Number(form.quantiteReelle) < 0) {
            setErreur("Saisir le stock reel.");
            return;
        }
        try {
            await api.post("/inventaires", {
                ...form,
                articleId: Number(form.articleId),
                quantiteReelle: Number(form.quantiteReelle),
                utilisateurNom: localStorage.getItem("nomUtilisateur") || "Admin"
            });
            setMessage("Stock regularise et operation enregistree.");
            setForm({ articleId: "", quantiteReelle: "", type: "REGULARISATION", motif: "" });
            await charger();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible d'enregistrer l'inventaire."));
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow border-0 mb-4">
                <div className="card-header bg-primary text-white">
                    <h3>Inventaire stock</h3>
                </div>
                <div className="card-body">
                    {erreur && <div className="alert alert-danger">{erreur}</div>}
                    {message && <div className="alert alert-success">{message}</div>}

                    <div className="row g-3">
                        <div className="col-md-4">
                            <label>Article</label>
                            <select className="form-control" value={form.articleId}
                                    onChange={e => setForm({ ...form, articleId: e.target.value })}>
                                <option value="">-- Choisir article --</option>
                                {articles.map(article => (
                                    <option key={article.id} value={article.id}>
                                        {article.nom} - stock {article.quantiteStock || 0}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label>Stock systeme</label>
                            <input className="form-control" disabled
                                   value={articleSelectionne ? articleSelectionne.quantiteStock || 0 : ""} />
                        </div>
                        <div className="col-md-2">
                            <label>Stock reel</label>
                            <input type="number" className="form-control" value={form.quantiteReelle}
                                   onChange={e => setForm({ ...form, quantiteReelle: e.target.value })} />
                        </div>
                        <div className="col-md-4">
                            <label>Type</label>
                            <select className="form-control" value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value })}>
                                <option value="INITIALISATION">Initialisation</option>
                                <option value="REGULARISATION">Regularisation</option>
                                <option value="PERTE">Perte</option>
                            </select>
                        </div>
                    </div>

                    <div className="row g-3 mt-2">
                        <div className="col-md-8">
                            <label>Motif</label>
                            <input className="form-control" value={form.motif}
                                   placeholder="Exemple : inventaire mensuel, casse, perte, correction..."
                                   onChange={e => setForm({ ...form, motif: e.target.value })} />
                        </div>
                        <div className="col-md-2">
                            <label>Ecart</label>
                            <input className="form-control" disabled value={ecart.toFixed(2)} />
                        </div>
                        <div className="col-md-2">
                            <label>Valeur</label>
                            <input className="form-control" disabled value={`${valeurEcart.toFixed(3)} DT`} />
                        </div>
                    </div>

                    <button className="btn btn-primary mt-3" onClick={enregistrer}>
                        Enregistrer inventaire
                    </button>
                </div>
            </div>

            <div className="card shadow border-0">
                <div className="card-header bg-dark text-white">
                    <h4>Historique inventaire et pertes</h4>
                </div>
                <div className="card-body">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                        <tr>
                            <th>Date</th>
                            <th>Article</th>
                            <th>Type</th>
                            <th>Avant</th>
                            <th>Reel</th>
                            <th>Ecart</th>
                            <th>Valeur ecart</th>
                            <th>Motif</th>
                            <th>Utilisateur</th>
                        </tr>
                        </thead>
                        <tbody>
                        {operations.map(operation => (
                            <tr key={operation.id}>
                                <td>{operation.dateOperation ? new Date(operation.dateOperation).toLocaleString() : "-"}</td>
                                <td>{operation.articleNom}</td>
                                <td>{operation.type}</td>
                                <td>{Number(operation.quantiteAvant || 0).toFixed(2)}</td>
                                <td>{Number(operation.quantiteReelle || 0).toFixed(2)}</td>
                                <td className={Number(operation.ecart || 0) < 0 ? "text-danger fw-bold" : "text-success fw-bold"}>
                                    {Number(operation.ecart || 0).toFixed(2)}
                                </td>
                                <td>{Number(operation.valeurEcart || 0).toFixed(3)} DT</td>
                                <td>{operation.motif}</td>
                                <td>{operation.utilisateurNom}</td>
                            </tr>
                        ))}
                        {operations.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center text-muted">Aucune operation.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Inventaire;
