import React, { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function Utilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    const [form, setForm] = useState({
        username: "",
        password: "",
        nom: "",
        prenom: "",
        email: "",
        role: "CAISSIER",
        actif: true,
        departement: "",
        caisseOuverte: false
    });
    const [idModification, setIdModification] = useState(null);
    const [erreur, setErreur] = useState("");
    const [message, setMessage] = useState("");

    const charger = async () => {
        try {
            const { data } = await api.get("/utilisateurs");
            setUtilisateurs(data);
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de charger les utilisateurs."));
        }
    };

    useEffect(() => {
        charger();
    }, []);

    const changer = (champ, valeur) => {
        setForm({ ...form, [champ]: valeur });
    };

    const vider = () => {
        setForm({
            username: "",
            password: "",
            nom: "",
            prenom: "",
            email: "",
            role: "CAISSIER",
            actif: true,
            departement: "",
            caisseOuverte: false
        });
        setIdModification(null);
    };

    const enregistrer = async () => {
        setErreur("");
        setMessage("");
        if (!form.username.trim()) {
            setErreur("Le nom d'utilisateur est obligatoire.");
            return;
        }
        if (!idModification && !form.password.trim()) {
            setErreur("Le mot de passe est obligatoire.");
            return;
        }
        try {
            if (idModification) {
                await api.put(`/utilisateurs/${idModification}`, form);
                setMessage("Utilisateur modifié.");
            } else {
                await api.post("/utilisateurs", form);
                setMessage("Utilisateur ajouté.");
            }
            vider();
            await charger();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible d'enregistrer l'utilisateur."));
        }
    };

    const modifier = (utilisateur) => {
        setIdModification(utilisateur.id);
        setForm({
            username: utilisateur.username || "",
            password: "",
            nom: utilisateur.nom || "",
            prenom: utilisateur.prenom || "",
            email: utilisateur.email || "",
            role: utilisateur.role || "CAISSIER",
            actif: utilisateur.actif !== false,
            departement: utilisateur.departement || "",
            caisseOuverte: utilisateur.caisseOuverte || false
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const supprimer = async (id) => {
        if (!window.confirm("Supprimer cet utilisateur ?")) return;
        try {
            await api.delete(`/utilisateurs/${id}`);
            await charger();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de supprimer l'utilisateur."));
        }
    };

    const changerEtatUtilisateur = async (utilisateur, changements, messageSucces) => {
        try {
            setErreur("");
            setMessage("");
            await api.put(`/utilisateurs/${utilisateur.id}`, {
                username: utilisateur.username,
                password: "",
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                email: utilisateur.email,
                role: utilisateur.role,
                actif: utilisateur.actif,
                departement: utilisateur.departement,
                caisseOuverte: utilisateur.caisseOuverte,
                ...changements
            });
            setMessage(messageSucces);
            await charger();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible d'appliquer cette commande."));
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow mb-4">
                <div className="card-header bg-primary text-white">
                    <h3>{idModification ? "Modifier utilisateur" : "Administration - utilisateurs et caissiers"}</h3>
                </div>
                <div className="card-body">
                    {erreur && <div className="alert alert-danger">{erreur}</div>}
                    {message && <div className="alert alert-success">{message}</div>}

                    <div className="row mb-4">
                        <div className="col-md-3 mb-2">
                            <button className="btn btn-primary w-100 p-3" onClick={vider}>
                                + Ajouter caissier
                            </button>
                        </div>
                        <div className="col-md-3 mb-2">
                            <button className="btn btn-outline-primary w-100 p-3"
                                    onClick={() => setForm({ ...form, role: "ADMIN" })}>
                                + Ajouter admin
                            </button>
                        </div>
                        <div className="col-md-3 mb-2">
                            <a href="/clients" className="btn btn-outline-danger w-100 p-3">
                                Régler crédit client
                            </a>
                        </div>
                        <div className="col-md-3 mb-2">
                            <button className="btn btn-outline-secondary w-100 p-3" onClick={charger}>
                                Actualiser
                            </button>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label>Nom d'utilisateur</label>
                            <input className="form-control" value={form.username}
                                   onChange={e => changer("username", e.target.value)}/>
                        </div>
                        <div className="col">
                            <label>Mot de passe</label>
                            <input type="password" className="form-control" value={form.password}
                                   placeholder={idModification ? "Laisser vide pour garder l'ancien" : ""}
                                   onChange={e => changer("password", e.target.value)}/>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label>Nom</label>
                            <input className="form-control" value={form.nom}
                                   onChange={e => changer("nom", e.target.value)}/>
                        </div>
                        <div className="col">
                            <label>Prénom</label>
                            <input className="form-control" value={form.prenom}
                                   onChange={e => changer("prenom", e.target.value)}/>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label>Email</label>
                            <input className="form-control" value={form.email}
                                   onChange={e => changer("email", e.target.value)}/>
                        </div>
                        <div className="col">
                            <label>Rôle</label>
                            <select className="form-control" value={form.role}
                                    onChange={e => changer("role", e.target.value)}>
                                <option value="CAISSIER">Caissier</option>
                                <option value="ADMIN">Administrateur</option>
                            </select>
                        </div>
                    </div>

                    {form.role === "ADMIN" ? (
                        <div className="mb-3">
                            <label>Département</label>
                            <input className="form-control" value={form.departement}
                                   onChange={e => changer("departement", e.target.value)}/>
                        </div>
                    ) : (
                        <div className="form-check mb-3">
                            <input className="form-check-input" type="checkbox" checked={form.caisseOuverte}
                                   onChange={e => changer("caisseOuverte", e.target.checked)}/>
                            <label className="form-check-label">Caisse ouverte</label>
                        </div>
                    )}

                    <div className="form-check mb-3">
                        <input className="form-check-input" type="checkbox" checked={form.actif}
                               onChange={e => changer("actif", e.target.checked)}/>
                        <label className="form-check-label">Utilisateur actif</label>
                    </div>

                    <button className="btn btn-primary" onClick={enregistrer}>
                        {idModification ? "Mettre à jour" : "Ajouter utilisateur"}
                    </button>
                    {idModification && <button className="btn btn-secondary ms-2" onClick={vider}>Annuler</button>}
                </div>
            </div>

            <div className="card shadow">
                <div className="card-header bg-dark text-white">
                    <h4>Liste des utilisateurs</h4>
                </div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Utilisateur</th>
                            <th>Nom</th>
                            <th>Email</th>
                            <th>Rôle</th>
                            <th>État</th>
                            <th>Caisse</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {utilisateurs.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.nom} {u.prenom}</td>
                                <td>{u.email}</td>
                                <td>{u.role === "ADMIN" ? "Administrateur" : "Caissier"}</td>
                                <td>
                                    <span className={u.actif ? "badge bg-success" : "badge bg-secondary"}>
                                        {u.actif ? "Actif" : "Inactif"}
                                    </span>
                                </td>
                                <td>
                                    {u.role === "CAISSIER" ? (
                                        <span className={u.caisseOuverte ? "badge bg-success" : "badge bg-warning text-dark"}>
                                            {u.caisseOuverte ? "Ouverte" : "Fermée"}
                                        </span>
                                    ) : "-"}
                                </td>
                                <td style={{ minWidth: "180px" }}>
                                    <div className="d-grid gap-2">
                                        {u.role === "CAISSIER" && (
                                            <button
                                                className={u.caisseOuverte ? "btn btn-outline-warning btn-sm" : "btn btn-outline-success btn-sm"}
                                                onClick={() => changerEtatUtilisateur(
                                                    u,
                                                    { caisseOuverte: !u.caisseOuverte },
                                                    u.caisseOuverte ? "Caisse fermée." : "Caisse ouverte."
                                                )}
                                            >
                                                {u.caisseOuverte ? "Fermer caisse" : "Ouvrir caisse"}
                                            </button>
                                        )}
                                        <button
                                            className={u.actif ? "btn btn-outline-secondary btn-sm" : "btn btn-outline-success btn-sm"}
                                            onClick={() => changerEtatUtilisateur(
                                                u,
                                                { actif: !u.actif },
                                                u.actif ? "Utilisateur désactivé." : "Utilisateur activé."
                                            )}
                                        >
                                            {u.actif ? "Désactiver" : "Activer"}
                                        </button>
                                        <button className="btn btn-warning btn-sm" onClick={() => modifier(u)}>
                                            Modifier
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => supprimer(u.id)}>
                                            Supprimer
                                        </button>
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

export default Utilisateurs;
