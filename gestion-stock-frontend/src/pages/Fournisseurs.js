import React, { useEffect, useState } from "react";
import axios from "axios";

function Fournisseurs() {
    const [fournisseurs, setFournisseurs] = useState([]);

    const [idFournisseur, setIdFournisseur] = useState(null);
    const [nom, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [adresse, setAdresse] = useState("");

    useEffect(() => {
        afficherFournisseurs();
    }, []);

    const afficherFournisseurs = async () => {
        const response = await axios.get("http://localhost:8080/api/fournisseurs");
        setFournisseurs(response.data);
    };

    const viderFormulaire = () => {
        setIdFournisseur(null);
        setNom("");
        setTelephone("");
        setEmail("");
        setAdresse("");
    };

    const ajouterOuModifierFournisseur = async () => {
        const fournisseur = { nom, telephone, email, adresse };

        if (idFournisseur === null) {
            await axios.post("http://localhost:8080/api/fournisseurs", fournisseur);
        } else {
            await axios.put(`http://localhost:8080/api/fournisseurs/${idFournisseur}`, fournisseur);
        }

        afficherFournisseurs();
        viderFormulaire();
    };

    const preparerModification = (fournisseur) => {
        setIdFournisseur(fournisseur.id);
        setNom(fournisseur.nom);
        setTelephone(fournisseur.telephone);
        setEmail(fournisseur.email);
        setAdresse(fournisseur.adresse);
    };

    const supprimerFournisseur = async (id) => {
        await axios.delete(`http://localhost:8080/api/fournisseurs/${id}`);
        afficherFournisseurs();
    };

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-warning text-dark">
                    <h3>Gestion des fournisseurs</h3>
                </div>

                <div className="card-body">
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
                                placeholder="Téléphone"
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="col">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Adresse"
                                value={adresse}
                                onChange={(e) => setAdresse(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        className={idFournisseur === null ? "btn btn-warning mb-4" : "btn btn-success mb-4"}
                        onClick={ajouterOuModifierFournisseur}
                    >
                        {idFournisseur === null ? "Ajouter Fournisseur" : "Mettre à jour"}
                    </button>

                    {idFournisseur !== null && (
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
                            <th>Téléphone</th>
                            <th>Email</th>
                            <th>Adresse</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {fournisseurs.map((fournisseur) => (
                            <tr key={fournisseur.id}>
                                <td>{fournisseur.id}</td>
                                <td>{fournisseur.nom}</td>
                                <td>{fournisseur.telephone}</td>
                                <td>{fournisseur.email}</td>
                                <td>{fournisseur.adresse}</td>
                                <td>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => preparerModification(fournisseur)}
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => supprimerFournisseur(fournisseur.id)}
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

export default Fournisseurs;