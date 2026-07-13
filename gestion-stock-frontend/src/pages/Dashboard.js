import React, { useEffect, useMemo, useState } from "react";
import api, { getErrorMessage } from "../services/api";

const aujourdhui = () => new Date().toISOString().slice(0, 10);
const moisActuel = () => new Date().toISOString().slice(0, 7);
const anneeActuelle = () => String(new Date().getFullYear());

function Dashboard({ role }) {
    const estAdmin = role === "ADMIN";
    const [articles, setArticles] = useState([]);
    const [achats, setAchats] = useState([]);
    const [ventes, setVentes] = useState([]);
    const [clients, setClients] = useState([]);
    const [periode, setPeriode] = useState("jour");
    const [dateFiltre, setDateFiltre] = useState(aujourdhui());
    const [moisFiltre, setMoisFiltre] = useState(moisActuel());
    const [anneeFiltre, setAnneeFiltre] = useState(anneeActuelle());
    const [erreur, setErreur] = useState("");

    useEffect(() => {
        if (!estAdmin) return;

        Promise.all([
            api.get("/articles"),
            api.get("/achats"),
            api.get("/ventes"),
            api.get("/clients")
        ])
            .then(([articlesResponse, achatsResponse, ventesResponse, clientsResponse]) => {
                setArticles(articlesResponse.data);
                setAchats(achatsResponse.data);
                setVentes(ventesResponse.data);
                setClients(clientsResponse.data);
            })
            .catch(error => setErreur(getErrorMessage(error, "Impossible de charger le tableau de bord.")));
    }, [estAdmin]);

    const articleParId = useMemo(() => {
        const map = new Map();
        articles.forEach(article => map.set(Number(article.id), article));
        return map;
    }, [articles]);

    const dansPeriode = (date) => {
        if (!date) return false;
        if (periode === "jour") return date === dateFiltre;
        if (periode === "mois") return date.startsWith(moisFiltre);
        return date.startsWith(anneeFiltre);
    };

    const montant = valeur => Number(valeur || 0).toLocaleString("fr-FR", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    });

    const stats = useMemo(() => {
        if (!estAdmin) return null;

        const ventesFiltrees = ventes.filter(vente => dansPeriode(vente.dateVente));
        const achatsFiltres = achats.filter(achat => dansPeriode(achat.dateAchat));
        const totalVentes = ventesFiltrees.reduce((s, v) => s + Number(v.total || 0), 0);
        const totalEspece = ventesFiltrees
            .filter(v => v.modePaiement !== "CREDIT")
            .reduce((s, v) => s + Number(v.total || 0), 0);
        const totalCredit = ventesFiltrees
            .filter(v => v.modePaiement === "CREDIT")
            .reduce((s, v) => s + Number(v.reste ?? v.total ?? 0), 0);
        const totalAchats = achatsFiltres.reduce((s, a) => s + Number(a.total || 0), 0);
        const stockDisponible = articles.reduce((s, a) => s + Number(a.quantiteStock || 0), 0);
        const stockFaible = articles.filter(a =>
            Number(a.quantiteStock || 0) <= Number(a.seuilStock || 0)
        ).length;
        const creditClients = clients.reduce((s, c) => s + Number(c.credit || 0), 0);

        let gainEstime = 0;
        const parArticle = new Map();
        const parCategorie = new Map();
        const parCaissier = new Map();

        ventesFiltrees.forEach(vente => {
            const caissier = vente.caissierNom || "Non precise";
            const ancienCaissier = parCaissier.get(caissier) || { nom: caissier, recette: 0, credit: 0, nombre: 0 };
            parCaissier.set(caissier, {
                nom: caissier,
                recette: ancienCaissier.recette + Number(vente.total || 0),
                credit: ancienCaissier.credit + (vente.modePaiement === "CREDIT" ? Number(vente.reste ?? vente.total ?? 0) : 0),
                nombre: ancienCaissier.nombre + 1
            });

            (vente.lignes || []).forEach(ligne => {
                const article = articleParId.get(Number(ligne.articleId));
                const nomArticle = ligne.articleNom || article?.nom || "Article";
                const categorie = article?.categorieNom || "Sans categorie";
                const quantite = Number(ligne.quantite || 0);
                const prixVente = Number(ligne.prixVente || 0);
                const prixAchat = Number(article?.prixAchat || 0);
                const chiffre = quantite * prixVente;
                const gain = quantite * (prixVente - prixAchat);
                gainEstime += gain;

                const ancienArticle = parArticle.get(nomArticle) || { nom: nomArticle, quantite: 0, chiffre: 0, gain: 0 };
                parArticle.set(nomArticle, {
                    ...ancienArticle,
                    quantite: ancienArticle.quantite + quantite,
                    chiffre: ancienArticle.chiffre + chiffre,
                    gain: ancienArticle.gain + gain
                });

                const ancienCategorie = parCategorie.get(categorie) || { nom: categorie, chiffre: 0, gain: 0 };
                parCategorie.set(categorie, {
                    ...ancienCategorie,
                    chiffre: ancienCategorie.chiffre + chiffre,
                    gain: ancienCategorie.gain + gain
                });
            });
        });

        return {
            totalVentes,
            totalEspece,
            totalCredit,
            totalAchats,
            gainEstime,
            stockDisponible,
            stockFaible,
            creditClients,
            ventesAnnulees: ventesFiltrees.filter(v => v.statut === "ANNULEE").length,
            parArticle: Array.from(parArticle.values()).sort((a, b) => b.chiffre - a.chiffre).slice(0, 8),
            parCategorie: Array.from(parCategorie.values()).sort((a, b) => b.chiffre - a.chiffre).slice(0, 8),
            parCaissier: Array.from(parCaissier.values()).sort((a, b) => b.recette - a.recette)
        };
    }, [achats, articles, articleParId, clients, dateFiltre, moisFiltre, anneeFiltre, periode, ventes, estAdmin]);

    if (!estAdmin) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2>Tableau de bord caissier</h2>
                        <p className="text-muted mb-0">Acces limite aux operations autorisees.</p>
                    </div>
                    <div className="badge bg-dark fs-6">CAISSIER</div>
                </div>

                <div className="row g-3">
                    <Carte couleur="success" titre="Ventes" valeur="Saisie des ventes" />
                    <Carte couleur="info" titre="Achats" valeur="Saisie des achats" />
                    <Carte couleur="primary" titre="Caisse" valeur="Ouverture / cloture" />
                    <Carte couleur="secondary" titre="Clients" valeur="Credits clients" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            {erreur && <div className="alert alert-danger">{erreur}</div>}

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2>Tableau de bord administrateur</h2>
                    <p className="text-muted mb-0">Statistiques completes : caisse, stock, credit, gains et recettes.</p>
                </div>
                <div className="badge bg-dark fs-6">ADMIN</div>
            </div>

            <div className="card shadow mb-4">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <label>Periode</label>
                            <select className="form-control" value={periode} onChange={e => setPeriode(e.target.value)}>
                                <option value="jour">Jour</option>
                                <option value="mois">Mois</option>
                                <option value="annee">Annee</option>
                            </select>
                        </div>
                        {periode === "jour" && (
                            <div className="col-md-3">
                                <label>Date</label>
                                <input type="date" className="form-control" value={dateFiltre}
                                       onChange={e => setDateFiltre(e.target.value)}/>
                            </div>
                        )}
                        {periode === "mois" && (
                            <div className="col-md-3">
                                <label>Mois</label>
                                <input type="month" className="form-control" value={moisFiltre}
                                       onChange={e => setMoisFiltre(e.target.value)}/>
                            </div>
                        )}
                        {periode === "annee" && (
                            <div className="col-md-3">
                                <label>Annee</label>
                                <input type="number" className="form-control" value={anneeFiltre}
                                       onChange={e => setAnneeFiltre(e.target.value)}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {stats && (
                <>
                    <div className="row g-3">
                        <Carte couleur="primary" titre="Recettes periode" valeur={`${montant(stats.totalVentes)} DT`} />
                        <Carte couleur="success" titre="Ventes especes" valeur={`${montant(stats.totalEspece)} DT`} />
                        <Carte couleur="danger" titre="Ventes credit" valeur={`${montant(stats.totalCredit)} DT`} />
                        <Carte couleur="info" titre="Achats periode" valeur={`${montant(stats.totalAchats)} DT`} />
                        <Carte couleur="dark" titre="Gain estime" valeur={`${montant(stats.gainEstime)} DT`} />
                        <Carte couleur="secondary" titre="Stock disponible" valeur={montant(stats.stockDisponible)} />
                        <Carte couleur="warning" titre="Stock faible" valeur={stats.stockFaible} texteFonce />
                        <Carte couleur="danger" titre="Credit clients total" valeur={`${montant(stats.creditClients)} DT`} />
                        <Carte couleur="secondary" titre="Ventes annulees" valeur={stats.ventesAnnulees} />
                    </div>

                    <div className="row mt-4">
                        <div className="col-md-12 mb-4">
                            <TableauTitre titre="Recettes par caissier" />
                            <table className="table table-bordered bg-white">
                                <thead className="table-dark">
                                <tr><th>Caissier</th><th>Nombre ventes</th><th>Recette</th><th>Credit</th></tr>
                                </thead>
                                <tbody>
                                {stats.parCaissier.map(item => (
                                    <tr key={item.nom}>
                                        <td>{item.nom}</td>
                                        <td>{item.nombre}</td>
                                        <td>{montant(item.recette)} DT</td>
                                        <td>{montant(item.credit)} DT</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <TableauTitre titre="Gain / recette par article" />
                            <table className="table table-bordered bg-white">
                                <thead className="table-dark">
                                <tr><th>Article</th><th>Qte</th><th>Recette</th><th>Gain estime</th></tr>
                                </thead>
                                <tbody>
                                {stats.parArticle.map(item => (
                                    <tr key={item.nom}>
                                        <td>{item.nom}</td>
                                        <td>{montant(item.quantite)}</td>
                                        <td>{montant(item.chiffre)} DT</td>
                                        <td>{montant(item.gain)} DT</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-6">
                            <TableauTitre titre="Gain / recette par categorie" />
                            <table className="table table-bordered bg-white">
                                <thead className="table-dark">
                                <tr><th>Categorie</th><th>Recette</th><th>Gain estime</th></tr>
                                </thead>
                                <tbody>
                                {stats.parCategorie.map(item => (
                                    <tr key={item.nom}>
                                        <td>{item.nom}</td>
                                        <td>{montant(item.chiffre)} DT</td>
                                        <td>{montant(item.gain)} DT</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function Carte({ couleur, titre, valeur, texteFonce }) {
    return (
        <div className="col-md-3">
            <div className={`card bg-${couleur} ${texteFonce ? "text-dark" : "text-white"} shadow h-100`}>
                <div className="card-body">
                    <h6>{titre}</h6>
                    <h3>{valeur}</h3>
                </div>
            </div>
        </div>
    );
}

function TableauTitre({ titre }) {
    return <h5 className="mb-3">{titre}</h5>;
}

export default Dashboard;
