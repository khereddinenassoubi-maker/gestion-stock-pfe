import React, { useEffect, useState } from "react";
import axios from "axios";

function Clients() {

    const [clients, setClients] = useState([]);

    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [adresse, setAdresse] = useState("");

    useEffect(() => {
        afficherClients();
    }, []);

    const afficherClients = async () => {

        const response = await axios.get("http://localhost:8080/api/clients");

        setClients(response.data);
    };

    const ajouterClient = async () => {

        const client = {
            nom,
            prenom,
            telephone,
            email,
            adresse,
            credit: 0
        };

        await axios.post("http://localhost:8080/api/clients", client);

        afficherClients();

        setNom("");
        setPrenom("");
        setTelephone("");
        setEmail("");
        setAdresse("");
    };

    const supprimerClient = async (id) => {

        await axios.delete(`http://localhost:8080/api/clients/${id}`);

        afficherClients();
    };

    return (

        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-header bg-success text-white">
                    <h3>Gestion des clients</h3>
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
                        className="btn btn-success mb-4"
                        onClick={ajouterClient}
                    >
                        Ajouter Client
                    </button>

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
                                <td>{client.credit}</td>

                                <td>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => supprimerClient(client.id)}
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

export default Clients;