import React, { useState } from "react";
import api, { getErrorMessage } from "../services/api";

function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [erreur, setErreur] = useState("");
    const [chargement, setChargement] = useState(false);

    const connecter = async (e) => {
        e.preventDefault();
        setErreur("");

        if (!username.trim() || !password.trim()) {
            setErreur("Saisir le nom utilisateur et le mot de passe.");
            return;
        }

        try {
            setChargement(true);
            const { data } = await api.post("/utilisateurs/login", {
                username: username.trim(),
                password: password.trim()
            });
            onLogin(data);
        } catch (error) {
            setErreur(getErrorMessage(error, "Connexion impossible. Verifiez le backend et les identifiants."));
        } finally {
            setChargement(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow border-0" style={{ width: "420px" }}>
                <div className="card-header bg-dark text-white text-center">
                    <h3>Gestion Stock</h3>
                    <div>Connexion</div>
                </div>
                <div className="card-body p-4">
                    {erreur && <div className="alert alert-danger">{erreur}</div>}

                    <form onSubmit={connecter}>
                        <div className="mb-3">
                            <label>Nom utilisateur</label>
                            <input
                                className="form-control form-control-lg"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="mb-4">
                            <label>Mot de passe</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary w-100 btn-lg" disabled={chargement}>
                            {chargement ? "Connexion..." : "Se connecter"}
                        </button>
                    </form>

                    <div className="text-muted text-center mt-3">
                        Premier acces : admin / admin
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
