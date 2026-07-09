import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { getErrorMessage } from "../services/api";

const ligneVide = { articleId: "", quantite: 1, prixVente: 0 };
const dateDuJour = () => new Date().toISOString().slice(0, 10);

function Ventes() {
    const [clients, setClients] = useState([]);
    const [articles, setArticles] = useState([]);
    const [ventes, setVentes] = useState([]);
    const [clientId, setClientId] = useState("");
    const [modePaiement, setModePaiement] = useState("ESPECE");
    const [dateVente, setDateVente] = useState(dateDuJour());
    const [lignes, setLignes] = useState([{ ...ligneVide }]);
    const [codeBarresScan, setCodeBarresScan] = useState("");
    const [venteId, setVenteId] = useState(null);
    const [erreur, setErreur] = useState("");
    const [message, setMessage] = useState("");
    const [chargement, setChargement] = useState(false);

    const charger = async () => {
        try {
            const [c, a, v] = await Promise.all([
                api.get("/clients"),
                api.get("/articles"),
                api.get("/ventes")
            ]);
            setClients(c.data);
            setArticles(a.data);
            setVentes(v.data);
        } catch (e) {
            setErreur(getErrorMessage(e, "Impossible de charger les ventes."));
        }
    };

    useEffect(() => {
        charger();
    }, []);

    const modifierLigne = (index, champ, valeur) => {
        const copie = lignes.map(ligne => ({ ...ligne }));
        copie[index][champ] = valeur;

        if (champ === "articleId") {
            const article = articles.find(a => a.id === Number(valeur));
            copie[index].prixVente = article?.prixVente || 0;
        }

        setLignes(copie);
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
            const indexExistant = lignesActuelles.findIndex(l => Number(l.articleId) === Number(article.id));
            if (indexExistant >= 0) {
                return lignesActuelles.map((ligne, index) => index === indexExistant
                    ? { ...ligne, quantite: Number(ligne.quantite || 0) + 1 }
                    : ligne);
            }

            const nouvelleLigne = {
                articleId: String(article.id),
                quantite: 1,
                prixVente: article.prixVente || 0
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

    const total = lignes.reduce((s, l) =>
        s + Number(l.quantite || 0) * Number(l.prixVente || 0), 0);

    const montant = valeur => Number(valeur || 0).toLocaleString("fr-FR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    });

    const totalCredit = ventes
        .filter(v => v.modePaiement === "CREDIT")
        .reduce((s, v) => s + Number(v.reste ?? v.total ?? 0), 0);

    const totalEspece = ventes
        .filter(v => v.modePaiement !== "CREDIT")
        .reduce((s, v) => s + Number(v.total || 0), 0);

    const reinitialiser = () => {
        setClientId("");
        setModePaiement("ESPECE");
        setDateVente(dateDuJour());
        setLignes([{ ...ligneVide }]);
        setVenteId(null);
        setErreur("");
    };

    const enregistrer = async (modeChoisi) => {
        setErreur("");
        setMessage("");
        setModePaiement(modeChoisi);

        if (!dateVente || lignes.some(l => !l.articleId)) {
            setErreur("La date et les articles sont obligatoires.");
            return;
        }

        if (lignes.some(l => Number(l.quantite) <= 0 || Number(l.prixVente) < 0)) {
            setErreur("Les quantités et les prix doivent être valides.");
            return;
        }

        if (modeChoisi === "CREDIT" && !clientId) {
            setErreur("Pour une vente à crédit, il faut choisir un client enregistré.");
            return;
        }

        const dto = {
            clientId: clientId ? Number(clientId) : null,
            dateVente,
            modePaiement: modeChoisi,
            caissierNom: localStorage.getItem("nomUtilisateur") || "Caissier",
            lignes: lignes.map(l => ({
                articleId: Number(l.articleId),
                quantite: Number(l.quantite),
                prixVente: Number(l.prixVente)
            }))
        };

        try {
            setChargement(true);
            if (venteId) {
                await api.put(`/ventes/${venteId}`, dto);
            } else {
                await api.post("/ventes", dto);
            }
            setMessage(venteId ? "Vente modifiée avec succès." : "Vente enregistrée avec succès.");
            reinitialiser();
            await charger();
        } catch (e) {
            setErreur(getErrorMessage(e, "Impossible d'enregistrer la vente."));
        } finally {
            setChargement(false);
        }
    };

    const chargerVente = async id => {
        try {
            const { data } = await api.get(`/ventes/${id}`);
            setVenteId(id);
            setClientId(data.clientId ? String(data.clientId) : "");
            setModePaiement(data.modePaiement || "ESPECE");
            setDateVente(data.dateVente || "");
            setLignes(data.lignes?.length ? data.lignes.map(l => ({
                articleId: l.articleId ? String(l.articleId) : "",
                quantite: l.quantite,
                prixVente: l.prixVente
            })) : [{ ...ligneVide }]);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e) {
            setErreur(getErrorMessage(e, "Impossible de charger la vente."));
        }
    };

    const annulerVente = async id => {
        if (!window.confirm("Annuler cette vente et restaurer son stock ?")) return;
        try {
            await api.put(`/ventes/${id}/annuler`);
            await charger();
        } catch (e) {
            setErreur(getErrorMessage(e, "Impossible d'annuler la vente."));
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow mb-4">
                <div className="card-header bg-success text-white">
                    <h3>{venteId ? `Modification de la vente #${venteId}` : "Nouvelle facture de vente"}</h3>
                </div>

                <div className="card-body">
                    {erreur && <div className="alert alert-danger">{erreur}</div>}
                    {message && <div className="alert alert-success">{message}</div>}

                    <div className="d-flex flex-wrap gap-2 mb-3">
                        <Link to="/clients" className="btn btn-primary">
                            + Ajouter un client
                        </Link>
                        <Link to="/ajouter-article" className="btn btn-primary">
                            + Ajouter un article
                        </Link>
                        <Link to="/clients" className="btn btn-outline-danger">
                            Régler crédit / Avance client
                        </Link>
                        <button className="btn btn-outline-secondary" onClick={charger}>
                            Actualiser les listes
                        </button>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label>Client</label>
                            <select className="form-control" value={clientId} onChange={e => setClientId(e.target.value)}>
                                <option value="">Passager — paiement en espèces</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.nom} {c.prenom}</option>)}
                            </select>
                            <small className="text-muted">
                                {clientId ? "Client enregistré sélectionné" : "Client passager"}
                            </small>
                        </div>

                        <div className="col">
                            <label>Date de vente</label>
                            <input type="date" className="form-control" value={dateVente}
                                   onChange={e => setDateVente(e.target.value)}/>
                        </div>
                    </div>

                    {false && <>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <button
                                    type="button"
                                    className={`btn w-100 text-start p-3 ${modePaiement === "ESPECE" ? "btn-success" : "btn-outline-success"}`}
                                    onClick={() => setModePaiement("ESPECE")}
                                >
                                    <div className="fs-5 fw-bold">Espèces</div>
                                    <small>Paiement immédiat pour client passager ou client enregistré.</small>
                                </button>
                            </div>
                            <div className="col-md-6">
                                <button
                                    type="button"
                                    className={`btn w-100 text-start p-3 ${modePaiement === "CREDIT" ? "btn-danger" : "btn-outline-danger"}`}
                                    onClick={() => setModePaiement("CREDIT")}
                                >
                                    <div className="fs-5 fw-bold">Crédit</div>
                                    <small>Ajoute le reste au crédit du client sélectionné.</small>
                                </button>
                            </div>
                        </div>
                        {modePaiement === "CREDIT" && !clientId && (
                            <div className="text-danger small mt-1">
                                Choisissez un client enregistré pour utiliser le crédit.
                            </div>
                        )}
                    </>}

                    <div className="card border-primary mb-3">
                        <div className="card-body">
                            <label className="form-label fw-bold">Scanner code-barres</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="Scannez le code-barres ici puis Entrée"
                                value={codeBarresScan}
                                onChange={e => setCodeBarresScan(e.target.value)}
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
                            <th>Stock</th>
                            <th>Quantité</th>
                            <th>Prix vente</th>
                            <th>Sous-total</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {lignes.map((l, i) => {
                            const article = articles.find(a => a.id === Number(l.articleId));
                            return (
                                <tr key={i}>
                                    <td>
                                        <div className="input-group">
                                            <select className="form-control" value={l.articleId}
                                                    onChange={e => modifierLigne(i, "articleId", e.target.value)}>
                                                <option value="">-- Article --</option>
                                                {articles.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
                                            </select>
                                            <Link to="/ajouter-article" className="btn btn-outline-primary" title="Ajouter un nouvel article">
                                                + Article
                                            </Link>
                                        </div>
                                    </td>
                                    <td>{article?.codeBarres || "-"}</td>
                                    <td>{article?.quantiteStock ?? "-"}</td>
                                    <td>
                                        <input className="form-control" type="number" min="0.001" step="0.001"
                                               value={l.quantite}
                                               onChange={e => modifierLigne(i, "quantite", e.target.value)}/>
                                    </td>
                                    <td>
                                        <input className="form-control" type="number" min="0" step="0.001"
                                               value={l.prixVente}
                                               onChange={e => modifierLigne(i, "prixVente", e.target.value)}/>
                                    </td>
                                    <td>{montant(Number(l.quantite) * Number(l.prixVente))} DT</td>
                                    <td>
                                        <button className="btn btn-danger btn-sm" disabled={lignes.length === 1}
                                                onClick={() => setLignes(lignes.filter((_, x) => x !== i))}>
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    <button className="btn btn-secondary" onClick={() => setLignes([...lignes, { ...ligneVide }])}>
                        + Ajouter une ligne
                    </button>
                    <h4 className="mt-3">Total : {montant(total)} DT</h4>
                    <div className="row g-3 mt-2">
                        <div className="col-md-6">
                            <button
                                className="btn btn-success btn-lg w-100 p-3"
                                disabled={chargement}
                                onClick={() => enregistrer("ESPECE")}
                            >
                                <div className="fw-bold">Enregistrer en espèces</div>
                                <small>Paiement immédiat, sans crédit client.</small>
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button
                                className="btn btn-danger btn-lg w-100 p-3"
                                disabled={chargement}
                                onClick={() => enregistrer("CREDIT")}
                            >
                                <div className="fw-bold">Enregistrer à crédit</div>
                                <small>Choisir un client, puis ajouter le montant à son crédit.</small>
                            </button>
                        </div>
                    </div>
                    {chargement && <div className="text-muted mt-2">Enregistrement...</div>}
                    {venteId && (
                        <button className="btn btn-outline-secondary mt-2 ms-2" onClick={reinitialiser}>
                            Annuler
                        </button>
                    )}
                </div>
            </div>

            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card border-success">
                        <div className="card-body">
                            <h6 className="text-success">Ventes espèces</h6>
                            <h4>{montant(totalEspece)} DT</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-danger">
                        <div className="card-body">
                            <h6 className="text-danger">Crédit clients</h6>
                            <h4>{montant(totalCredit)} DT</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-primary">
                        <div className="card-body">
                            <h6 className="text-primary">Nombre de ventes</h6>
                            <h4>{ventes.length}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow">
                <div className="card-header bg-dark text-white">
                    <h4>Liste des ventes</h4>
                </div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Client</th>
                            <th>Paiement</th>
                            <th>Statut</th>
                            <th>Total</th>
                            <th>Reste</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ventes.map(v => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>{v.dateVente}</td>
                                <td>{v.clientNom}</td>
                                <td>
                                    <span className={v.modePaiement === "CREDIT" ? "badge bg-danger" : "badge bg-success"}>
                                        {v.modePaiement === "CREDIT" ? "Crédit" : "Espèces"}
                                    </span>
                                </td>
                                <td>{v.statut || "TERMINEE"}</td>
                                <td>{montant(v.total)} DT</td>
                                <td>{v.modePaiement === "CREDIT" ? `${montant(v.reste ?? v.total)} DT` : "0,000 DT"}</td>
                                <td style={{ minWidth: "140px" }}>
                                    <div className="d-grid gap-2">
                                    <button className="btn btn-warning btn-sm" onClick={() => chargerVente(v.id)}>
                                        Modifier
                                    </button>
                                    {v.statut !== "ANNULEE" && (
                                        <button className="btn btn-danger btn-sm" onClick={() => annulerVente(v.id)}>
                                            Annuler
                                        </button>
                                    )}
                                    </div>
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

export default Ventes;
