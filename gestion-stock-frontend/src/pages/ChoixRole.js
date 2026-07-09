import React, { useState } from "react";

function ChoixRole({ onChoisirRole }) {
    const [nomUtilisateur, setNomUtilisateur] = useState("");

    const choisir = (role) => {
        onChoisirRole(role, nomUtilisateur.trim() || (role === "ADMIN" ? "Admin" : "Caissier"));
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="container">
                <div className="text-center mb-4">
                    <h1>Gestion Stock</h1>
                </div>

                <div className="row justify-content-center mb-4">
                    <div className="col-md-6">
                        <label>Nom utilisateur</label>
                        <input
                            className="form-control form-control-lg"
                            value={nomUtilisateur}
                            onChange={e => setNomUtilisateur(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-md-4 mb-3">
                        <button className="btn btn-primary w-100 p-5 shadow" onClick={() => choisir("ADMIN")}>
                            <h2>Admin</h2>
                        </button>
                    </div>

                    <div className="col-md-4 mb-3">
                        <button className="btn btn-success w-100 p-5 shadow" onClick={() => choisir("CAISSIER")}>
                            <h2>Caissier</h2>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChoixRole;
