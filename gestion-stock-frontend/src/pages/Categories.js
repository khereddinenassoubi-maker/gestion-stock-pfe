import React, { useEffect, useState } from "react";
import axios from "axios";

function Categories() {

    const [categories, setCategories] = useState([]);

    const [idCategorie, setIdCategorie] = useState(null);
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        afficherCategories();
    }, []);

    const afficherCategories = async () => {
        const response = await axios.get("http://localhost:8080/api/categories");
        setCategories(response.data);
    };

    const viderFormulaire = () => {
        setIdCategorie(null);
        setNom("");
        setDescription("");
    };

    const ajouterOuModifierCategorie = async () => {

        const categorie = {
            nom,
            description
        };

        if (idCategorie === null) {
            await axios.post("http://localhost:8080/api/categories", categorie);
        } else {
            await axios.put(
                `http://localhost:8080/api/categories/${idCategorie}`,
                categorie
            );
        }

        afficherCategories();
        viderFormulaire();
    };

    const preparerModification = (categorie) => {
        setIdCategorie(categorie.id);
        setNom(categorie.nom);
        setDescription(categorie.description);
    };

    const supprimerCategorie = async (id) => {
        await axios.delete(`http://localhost:8080/api/categories/${id}`);
        afficherCategories();
    };

    return (
        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-header bg-primary text-white">
                    <h3>Gestion des catégories</h3>
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
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                    </div>

                    <button
                        className={
                            idCategorie === null
                                ? "btn btn-primary mb-4"
                                : "btn btn-warning mb-4"
                        }
                        onClick={ajouterOuModifierCategorie}
                    >
                        {idCategorie === null
                            ? "Ajouter Catégorie"
                            : "Mettre à jour"}
                    </button>

                    {idCategorie !== null && (
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
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>

                        {categories.map((categorie) => (

                            <tr key={categorie.id}>

                                <td>{categorie.id}</td>
                                <td>{categorie.nom}</td>
                                <td>{categorie.description}</td>

                                <td>

                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() =>
                                            preparerModification(categorie)
                                        }
                                    >
                                        Modifier
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() =>
                                            supprimerCategorie(categorie.id)
                                        }
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

export default Categories;