import React, { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function Clients() {
    const [clients, setClients] = useState([]);

    const [idClient, setIdClient] = useState(null);
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [adresse, setAdresse] = useState("");
    const [clientPaiement, setClientPaiement] = useState(null);
    const [montantPaiement, setMontantPaiement] = useState("");
    const [paiements, setPaiements] = useState([]);
    const [erreur, setErreur] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        afficherClients();
    }, []);

    const afficherClients = async () => {
        try {
            const response = await api.get("/clients");
            setClients(response.data);
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de charger les clients."));
        }
    };

    const viderFormulaire = () => {
        setIdClient(null);
        setNom("");
        setPrenom("");
        setTelephone("");
        setEmail("");
        setAdresse("");
    };

    const ajouterOuModifierClient = async () => {
        const client = {
            nom,
            prenom,
            telephone,
            email,
            adresse,
            credit: idClient === null ? 0 : undefined
        };

        try {
            if (!nom.trim()) {
                setErreur("Le nom du client est obligatoire.");
                return;
            }
            if (idClient === null) {
                await api.post("/clients", client);
            } else {
                await api.put(`/clients/${idClient}`, client);
            }
            setMessage(idClient === null ? "Client ajouté." : "Client modifié.");
            afficherClients();
            viderFormulaire();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible d'enregistrer le client."));
        }
    };

    const preparerModification = (client) => {
        setIdClient(client.id);
        setNom(client.nom);
        setPrenom(client.prenom);
        setTelephone(client.telephone);
        setEmail(client.email);
        setAdresse(client.adresse);
    };

    const supprimerClient = async (id) => {
        if (!window.confirm("Supprimer ce client ?")) return;
        try {
            await api.delete(`/clients/${id}`);
            afficherClients();
        } catch (error) {
            setErreur(getErrorMessage(error, "Ce client est probablement lié à des ventes."));
        }
    };

    const ouvrirPaiement = async (client) => {
        if (Number(client.credit || 0) <= 0) {
            setClientPaiement(null);
            setPaiements([]);
            setErreur("");
            setMessage("Ce client n'a pas de crédit à payer pour le moment.");
            return;
        }

        setClientPaiement(client);
        setMontantPaiement("");
        setErreur("");
        setMessage("");
        try {
            const response = await api.get(`/clients/${client.id}/paiements`);
            setPaiements(response.data);
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible de charger les avances."));
        }
    };

    const enregistrerPaiement = async () => {
        try {
            setErreur("");
            setMessage("");
            if (!clientPaiement) {
                setErreur("Veuillez choisir un client.");
                return;
            }
            const montantSaisi = Number(montantPaiement);
            if (!montantSaisi || montantSaisi <= 0) {
                setErreur("Veuillez saisir un montant d'avance valide.");
                return;
            }
            if (montantSaisi > Number(clientPaiement.credit || 0)) {
                setErreur("L'avance ne peut pas dépasser le crédit restant.");
                return;
            }
            await api.post(`/clients/${clientPaiement.id}/paiements`, {
                montant: montantSaisi
            });
            setMessage("Avance client enregistrée.");
            setClientPaiement(null);
            setMontantPaiement("");
            await afficherClients();
        } catch (error) {
            setErreur(getErrorMessage(error, "Impossible d'enregistrer l'avance."));
        }
    };

    const montant = valeur => Number(valeur || 0).toLocaleString("fr-FR", {
        minimumFractionDigits: 3, maximumFractionDigits: 3
    });

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-success text-white">
                    <h3>Gestion des clients</h3>
                </div>

                <div className="card-body">
                    {erreur && <div className="alert alert-danger">{erreur}</div>}
                    {message && <div className="alert alert-success">{message}</div>}
                    {clientPaiement && (
                        <div className="card border-primary mb-4">
                            <div className="card-body">
                                <h5>Avance de {clientPaiement.nom} {clientPaiement.prenom}</h5>
                                <p>Crédit restant : <strong>{montant(clientPaiement.credit)} DT</strong></p>
                                <div className="input-group mb-3">
                                    <input type="number" min="0.001" step="0.001"
                                           className="form-control" placeholder="Montant de l'avance"
                                           value={montantPaiement}
                                           onChange={e => setMontantPaiement(e.target.value)}/>
                                    <button className="btn btn-primary" onClick={enregistrerPaiement}>
                                        Encaisser
                                    </button>
                                    <button className="btn btn-outline-secondary"
                                            onClick={() => setClientPaiement(null)}>Annuler</button>
                                </div>
                                {paiements.length > 0 && (
                                    <small className="text-muted">
                                        Dernière avance : {montant(paiements[0].montant)} DT
                                    </small>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="row mb-3">
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nom"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                            />
                        </div>

                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Prénom"
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Téléphone"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                            />
                        </div>

                        <div className="col">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Adresse"
                            value={adresse}
                            onChange={(e) => setAdresse(e.target.value)}
                        />
                    </div>

                    <button
                        className={idClient === null ? "btn btn-success mb-4" : "btn btn-warning mb-4"}
                        onClick={ajouterOuModifierClient}
                    >
                        {idClient === null ? "Ajouter Client" : "Mettre à jour"}
                    </button>

                    {idClient !== null && (
                        <button
                            className="btn btn-secondary mb-4 ms-2"
                            onClick={viderFormulaire}
                        >
                            Annuler
                        </button>
                    )}

                    <table className="table table-bordered">
                        <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Téléphone</th>
                            <th>Email</th>
                            <th>Adresse</th>
                            <th>Crédit</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {clients.map((client) => (
                            <tr key={client.id}>
                                <td>{client.id}</td>
                                <td>{client.nom}</td>
                                <td>{client.prenom}</td>
                                <td>{client.telephone}</td>
                                <td>{client.email}</td>
                                <td>{client.adresse}</td>
                                <td>
                                    <span className={Number(client.credit) > 0 ? "badge bg-danger" : "badge bg-success"}>
                                        {montant(client.credit)} DT
                                    </span>
                                </td>

                                <td style={{ minWidth: "170px" }}>
                                    <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => preparerModification(client)}
                                    >
                                        Modifier
                                    </button>
                                    <button
                                        className={Number(client.credit || 0) > 0 ? "btn btn-primary btn-sm" : "btn btn-outline-secondary btn-sm"}
                                        onClick={() => ouvrirPaiement(client)}
                                        title={Number(client.credit || 0) > 0 ? "Encaisser une avance" : "Aucun crédit à payer"}
                                    >
                                        Avance
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => supprimerClient(client.id)}
                                    >
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

export default Clients;
