import React, { useEffect, useMemo, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function Caisse({ role, nomUtilisateur }) {
    const estAdmin = role === "ADMIN";
    const [caisses, setCaisses] = useState([]);
    const [caisseOuverte, setCaisseOuverte] = useState(null);
    const [montantOuverture, setMontantOuverture] = useState(0);
    const [fondAjoute, setFondAjoute] = useState(0);
    const [montantCloture, setMontantCloture] = useState(0);
    const [filtreCaissier, setFiltreCaissier] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [message, setMessage] = useState("");
    const [erreur, setErreur] = useState("");

    const charger = async () => {
        try {
            setErreur("");
            const { data } = await api.get("/caisses");
            setCaisses(data || []);
            const ouverte = await api.get("/caisses/ouverte", {
                params: { caissierNom: nomUtilisateur || "Caissier" }
            });
            setCaisseOuverte(ouverte.data || null);
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de charger la caisse."));
        }
    };

    useEffect(() => {
        charger();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nomUtilisateur]);

    const ouvrir = async () => {
        try {
            setErreur("");
            setMessage("");
            await api.post("/caisses/ouvrir", {
                caissierNom: nomUtilisateur || "Caissier",
                montantOuverture: Number(montantOuverture) || 0
            });
            setMessage("Caisse ouverte.");
            setMontantOuverture(0);
            await charger();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible d'ouvrir la caisse."));
        }
    };

    const cloturer = async () => {
        if (!caisseOuverte) return;
        try {
            setErreur("");
            setMessage("");
            await api.put(`/caisses/${caisseOuverte.id}/cloturer`, {
                montantCloture: Number(montantCloture) || 0
            });
            setMessage("Caisse cloturee.");
            setMontantCloture(0);
            await charger();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de cloturer la caisse."));
        }
    };

    const ajouterFond = async () => {
        if (!caisseOuverte) return;
        try {
            setErreur("");
            setMessage("");
            await api.put(`/caisses/${caisseOuverte.id}/fond`, {
                fondSupplementaire: Number(fondAjoute) || 0
            });
            setMessage("Fond de caisse ajoute.");
            setFondAjoute(0);
            await charger();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible d'ajouter le fond de caisse."));
        }
    };

    const caissesFiltrees = useMemo(() => {
        return caisses.filter(caisse => {
            const nomOk = !filtreCaissier || (caisse.caissierNom || "").toLowerCase().includes(filtreCaissier.toLowerCase());
            const date = caisse.dateOuverture ? caisse.dateOuverture.substring(0, 10) : "";
            const debutOk = !dateDebut || date >= dateDebut;
            const finOk = !dateFin || date <= dateFin;
            return nomOk && debutOk && finOk;
        });
    }, [caisses, filtreCaissier, dateDebut, dateFin]);

    const caissesVisibles = caissesFiltrees.filter(c =>
        estAdmin || (c.caissierNom || "").toLowerCase() === (nomUtilisateur || "Caissier").toLowerCase()
    );

    const totalEspece = caissesVisibles.reduce((sum, c) => sum + Number(c.totalEspece || 0), 0);
    const totalCredit = caissesVisibles.reduce((sum, c) => sum + Number(c.totalCredit || 0), 0);
    const totalAchats = caissesVisibles.reduce((sum, c) => sum + Number(c.totalAchats || 0), 0);
    const totalEncaissementsCredit = caissesVisibles.reduce((sum, c) => sum + Number(c.totalEncaissementsCredit || 0), 0);
    const totalFondAjoute = caissesVisibles.reduce((sum, c) => sum + Number(c.fondSupplementaire || 0), 0);
    const totalSolde = caissesVisibles.reduce((sum, c) => sum + Number(c.soldeTheorique || 0), 0);
    const totalEcart = caissesVisibles.reduce((sum, c) => sum + Number(c.ecart || 0), 0);

    return (
        <div className="container mt-4">
            <div className="card shadow border-0 mb-4">
                <div className="card-header bg-success text-white">
                    <h3>Caisse</h3>
                </div>
                <div className="card-body">
                    {erreur && <div className="alert alert-danger">{erreur}</div>}
                    {message && <div className="alert alert-success">{message}</div>}

                    <div className="row g-3">
                        <div className="col-md-4">
                            <div className="border rounded p-3 h-100">
                                <h5>Caissier</h5>
                                <div className="fs-5">{nomUtilisateur || "Caissier"}</div>
                                <span className={caisseOuverte ? "badge bg-success mt-2" : "badge bg-secondary mt-2"}>
                                    {caisseOuverte ? "Caisse ouverte" : "Caisse fermee"}
                                </span>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <label>Montant ouverture</label>
                            <input
                                type="number"
                                className="form-control mb-2"
                                value={montantOuverture}
                                disabled={!!caisseOuverte}
                                onChange={e => setMontantOuverture(e.target.value)}
                            />
                            <button className="btn btn-success w-100" disabled={!!caisseOuverte} onClick={ouvrir}>
                                Ouvrir caisse
                            </button>
                        </div>
                        <div className="col-md-4">
                            <label>Ajouter fond de caisse</label>
                            <input
                                type="number"
                                className="form-control mb-2"
                                value={fondAjoute}
                                disabled={!caisseOuverte}
                                onChange={e => setFondAjoute(e.target.value)}
                            />
                            <button className="btn btn-primary w-100 mb-3" disabled={!caisseOuverte} onClick={ajouterFond}>
                                Ajouter fond
                            </button>
                            <label>Montant reel a la cloture</label>
                            <input
                                type="number"
                                className="form-control mb-2"
                                value={montantCloture}
                                disabled={!caisseOuverte}
                                onChange={e => setMontantCloture(e.target.value)}
                            />
                            <button className="btn btn-danger w-100" disabled={!caisseOuverte} onClick={cloturer}>
                                Cloturer caisse
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow border-0">
                <div className="card-header bg-dark text-white">
                    <h4>{estAdmin ? "Suivi des caisses" : "Mes caisses"}</h4>
                </div>
                <div className="card-body">
                    {estAdmin && (
                        <div className="row g-2 mb-3">
                            <div className="col-md-4">
                                <input className="form-control" placeholder="Nom caissier"
                                       value={filtreCaissier} onChange={e => setFiltreCaissier(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <input type="date" className="form-control" value={dateDebut}
                                       onChange={e => setDateDebut(e.target.value)} />
                            </div>
                            <div className="col-md-4">
                                <input type="date" className="form-control" value={dateFin}
                                       onChange={e => setDateFin(e.target.value)} />
                            </div>
                        </div>
                    )}

                    <div className="row mb-3">
                        <div className="col-md-4">
                            <div className="border rounded p-3 bg-white">Especes : {totalEspece.toFixed(3)} DT</div>
                        </div>
                        <div className="col-md-4">
                            <div className="border rounded p-3 bg-white">Credit : {totalCredit.toFixed(3)} DT</div>
                        </div>
                        <div className="col-md-4">
                            <div className="border rounded p-3 bg-white">Achats : {totalAchats.toFixed(3)} DT</div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="border rounded p-3 bg-white">Encaissements credit : {totalEncaissementsCredit.toFixed(3)} DT</div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="border rounded p-3 bg-white">Fond ajoute : {totalFondAjoute.toFixed(3)} DT</div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="border rounded p-3 bg-white">Solde caisse : {totalSolde.toFixed(3)} DT</div>
                        </div>
                        <div className="col-md-4 mt-2">
                            <div className="border rounded p-3 bg-white">Ecart : {totalEcart.toFixed(3)} DT</div>
                        </div>
                    </div>

                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                        <tr>
                            <th>Caissier</th>
                            <th>Ouverture</th>
                            <th>Cloture</th>
                            <th>Fond depart</th>
                            <th>Fond ajoute</th>
                            <th>Especes</th>
                            <th>Credit</th>
                            <th>Achats</th>
                            <th>Enc. credit</th>
                            <th>Solde</th>
                            <th>Ecart</th>
                            <th>Statut</th>
                        </tr>
                        </thead>
                        <tbody>
                        {caissesVisibles.map(caisse => (
                                <tr key={caisse.id}>
                                    <td>{caisse.caissierNom}</td>
                                    <td>{caisse.dateOuverture ? new Date(caisse.dateOuverture).toLocaleString() : "-"}</td>
                                    <td>{caisse.dateCloture ? new Date(caisse.dateCloture).toLocaleString() : "-"}</td>
                                    <td>{Number(caisse.montantOuverture || 0).toFixed(3)} DT</td>
                                    <td>{Number(caisse.fondSupplementaire || 0).toFixed(3)} DT</td>
                                    <td>{Number(caisse.totalEspece || 0).toFixed(3)} DT</td>
                                    <td>{Number(caisse.totalCredit || 0).toFixed(3)} DT</td>
                                    <td>{Number(caisse.totalAchats || 0).toFixed(3)} DT</td>
                                    <td>{Number(caisse.totalEncaissementsCredit || 0).toFixed(3)} DT</td>
                                    <td>{Number(caisse.soldeTheorique || 0).toFixed(3)} DT</td>
                                    <td>{Number(caisse.ecart || 0).toFixed(3)} DT</td>
                                    <td>
                                        <span className={caisse.statut === "OUVERTE" ? "badge bg-success" : "badge bg-secondary"}>
                                            {caisse.statut}
                                        </span>
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

export default Caisse;
