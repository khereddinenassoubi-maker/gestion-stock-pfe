

import React, { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function Achats() {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [articles, setArticles] = useState([]);
    const [achats, setAchats] = useState([]);

    const [fournisseurId, setFournisseurId] = useState("");
    const [dateAchat, setDateAchat] = useState("");
    const [lignes, setLignes] = useState([
        { articleId: "", quantite: 1, prixAchat: 0 }
    ]);
    const [codeBarresScan, setCodeBarresScan] = useState("");
    const [erreur, setErreur] = useState("");
    const [message, setMessage] = useState("");
    const [chargement, setChargement] = useState(false);
    const [achatEnModification, setAchatEnModification] = useState(null);

    useEffect(() => {
        chargerDonnees();
    }, []);

    const chargerDonnees = async () => {
        try {
            setErreur("");
            const [resFournisseurs, resArticles, resAchats] = await Promise.all([
                api.get("/fournisseurs"),
                api.get("/articles"),
                api.get("/achats")
            ]);
            setFournisseurs(resFournisseurs.data);
            setArticles(resArticles.data);
            setAchats(resAchats.data);
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de charger les données."));
        }
    };

    const ajouterLigne = () => {
        setLignes([...lignes, { articleId: "", quantite: 1, prixAchat: 0 }]);
    };

    const modifierLigne = (index, champ, valeur) => {
        const nouvellesLignes = [...lignes];

        nouvellesLignes[index][champ] = valeur;

        if (champ === "articleId") {
            const article = articles.find(a => a.id === Number(valeur));

            if (article) {
                nouvellesLignes[index].prixAchat = article.prixAchat || 0;
            }
        }

        setLignes(nouvellesLignes);
    };

    const ajouterArticleScanne = (code) => {
        const codeNettoye = String(code || "").trim();
        if (!codeNettoye) return;

        const article = articles.find(a => String(a.codeBarres || "").trim() === codeNettoye);
        if (!article) {
            setErreur(`Aucun article trouvé avec le code-barres : ${codeNettoye}`);
            setMessage("");
            return;
        }

        setErreur("");
        setMessage(`${article.nom} ajouté par code-barres.`);
        setLignes(lignesActuelles => {
            const indexExistant = lignesActuelles.findIndex(ligne => Number(ligne.articleId) === Number(article.id));
            if (indexExistant >= 0) {
                return lignesActuelles.map((ligne, index) => index === indexExistant
                    ? { ...ligne, quantite: Number(ligne.quantite || 0) + 1 }
                    : ligne);
            }

            const nouvelleLigne = {
                articleId: String(article.id),
                quantite: 1,
                prixAchat: article.prixAchat || 0
            };

            if (lignesActuelles.length === 1 && !lignesActuelles[0].articleId) {
                return [nouvelleLigne];
            }

            return [...lignesActuelles, nouvelleLigne];
        });
    };

    const scannerCodeBarres = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        ajouterArticleScanne(codeBarresScan);
        setCodeBarresScan("");
    };

    const supprimerLigne = (index) => {
        if (lignes.length === 1) {
            setErreur("Une facture doit contenir au moins une ligne.");
            return;
        }
        const nouvellesLignes = lignes.filter((_, i) => i !== index);
        setLignes(nouvellesLignes);
    };

    const calculerTotal = () => {
        return lignes.reduce((total, ligne) => {
            return total + Number(ligne.quantite || 0) * Number(ligne.prixAchat || 0);
        }, 0);
    };

    const formaterMontant = (montant) =>
        Number(montant || 0).toLocaleString("fr-FR", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        });

    const enregistrerAchat = async () => {
        setErreur("");
        setMessage("");

        if (!fournisseurId) {
            setErreur("Veuillez choisir un fournisseur.");
            return;
        }
        if (!dateAchat) {
            setErreur("Veuillez saisir la date d'achat.");
            return;
        }
        if (lignes.some(ligne => !ligne.articleId)) {
            setErreur("Veuillez choisir un article pour chaque ligne.");
            return;
        }
        if (lignes.some(ligne => Number(ligne.quantite) <= 0)) {
            setErreur("La quantité doit être supérieure à zéro.");
            return;
        }
        if (lignes.some(ligne => Number(ligne.prixAchat) < 0)) {
            setErreur("Le prix d'achat ne peut pas être négatif.");
            return;
        }

        const achat = {
            dateAchat,
            fournisseurId: Number(fournisseurId),
            caissierNom: localStorage.getItem("nomUtilisateur") || "Caissier",
            lignes: lignes.map((ligne) => ({
                articleId: Number(ligne.articleId),
                quantite: Number(ligne.quantite),
                prixAchat: Number(ligne.prixAchat)
            }))
        };

        try {
            setChargement(true);
            if (achatEnModification) {
                await api.put(`/achats/${achatEnModification}`, achat);
            } else {
                await api.post("/achats", achat);
            }
            setFournisseurId("");
            setDateAchat("");
            setLignes([{ articleId: "", quantite: 1, prixAchat: 0 }]);
            setMessage(
                achatEnModification
                    ? "Facture modifiée avec succès."
                    : "Achat enregistré avec succès."
            );
            setAchatEnModification(null);
            await chargerDonnees();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible d'enregistrer l'achat."));
        } finally {
            setChargement(false);
        }
    };

    const modifierAchat = async (id) => {
        try {
            setErreur("");
            setMessage("");
            setChargement(true);
            const response = await api.get(`/achats/${id}`);
            const achat = response.data;
            setAchatEnModification(id);
            setFournisseurId(String(achat.fournisseurId || ""));
            setDateAchat(achat.dateAchat || "");
            setLignes(
                achat.lignes?.length
                    ? achat.lignes.map(ligne => ({
                        articleId: String(ligne.articleId),
                        quantite: ligne.quantite,
                        prixAchat: ligne.prixAchat
                    }))
                    : [{ articleId: "", quantite: 1, prixAchat: 0 }]
            );
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de charger cette facture."));
        } finally {
            setChargement(false);
        }
    };

    const annulerModification = () => {
        setAchatEnModification(null);
        setFournisseurId("");
        setDateAchat("");
        setLignes([{ articleId: "", quantite: 1, prixAchat: 0 }]);
        setErreur("");
        setMessage("");
    };

    const supprimerAchat = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cet achat ?")) return;
        try {
            setErreur("");
            await api.delete(`/achats/${id}`);
            setMessage("Achat supprimé avec succès.");
            await chargerDonnees();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de supprimer cet achat."));
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow mb-4">
                <div className="card-header bg-info text-white">
                    <h3>
                        {achatEnModification
                            ? `Modification de la facture #${achatEnModification}`
                            : "Nouvelle facture d'achat"}
                    </h3>
                </div>

                <div className="card-body">
                    {erreur && <div className="alert alert-danger">{erreur}</div>}
                    {message && <div className="alert alert-success">{message}</div>}
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

                    <div className="card border-primary mb-3">
                        <div className="card-body">
                            <label className="form-label fw-bold">Scanner code-barres</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Scannez le code-barres ici puis Entrée"
                                value={codeBarresScan}
                                onChange={(e) => setCodeBarresScan(e.target.value)}
                                onKeyDown={scannerCodeBarres}
                                autoFocus
                            />
                        </div>
                    </div>

                    <table className="table table-bordered">
                        <thead className="table-dark">
                        <tr>
                            <th>Article</th>
                            <th>Code-barres</th>
                            <th>Quantité</th>
                            <th>Prix Achat</th>
                            <th>Sous-total</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {lignes.map((ligne, index) => {
                            const article = articles.find(a => a.id === Number(ligne.articleId));
                            return (
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

                                <td>{article?.codeBarres || "-"}</td>

                                <td>
                                    <input
                                        type="number"
                                        min="0.001"
                                        step="0.001"
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
                                        min="0"
                                        step="0.001"
                                        className="form-control"
                                        value={ligne.prixAchat}
                                        onChange={(e) =>
                                            modifierLigne(index, "prixAchat", e.target.value)
                                        }
                                    />
                                </td>

                                <td>
                                    {formaterMontant(
                                        Number(ligne.quantite || 0) * Number(ligne.prixAchat || 0)
                                    )} DT
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
                            );
                        })}
                        </tbody>
                    </table>

                    <button className="btn btn-secondary mb-3" onClick={ajouterLigne}>
                        + Ajouter une ligne
                    </button>

                    <h4>Total : {formaterMontant(calculerTotal())} DT</h4>

                    <button
                        className="btn btn-info text-white mt-3"
                        onClick={enregistrerAchat}
                        disabled={chargement}
                    >
                        {chargement ? "Enregistrement..." : "Enregistrer l'achat"}
                    </button>
                    {achatEnModification && (
                        <button
                            className="btn btn-outline-secondary mt-3 ms-2"
                            onClick={annulerModification}
                            disabled={chargement}
                        >
                            Annuler
                        </button>
                    )}
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
                            <th>Caissier</th>
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
                                <td>{achat.caissierNom || "-"}</td>
                                <td>{achat.fournisseurNom}</td>
                                <td>{formaterMontant(achat.total)} DT</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => modifierAchat(achat.id)}
                                        disabled={chargement}
                                    >
                                        Modifier
                                    </button>
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
