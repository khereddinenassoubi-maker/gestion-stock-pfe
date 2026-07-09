import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ role, nomUtilisateur, onLogout }) {
    const estAdmin = role === "ADMIN";

    return (
        <div
            className="bg-dark text-white p-3"
            style={{
                width: "250px",
                minHeight: "100vh"
            }}
        >
            <h3 className="text-center mb-2">Gestion Stock</h3>
            <div className="text-center text-white-50 mb-4">
                <div>{estAdmin ? "Administrateur" : "Caissier"}</div>
                <small>{nomUtilisateur}</small>
            </div>

            <ul className="nav flex-column">
                <li className="nav-item mb-3">
                    <Link to="/" className="nav-link text-white">Tableau de bord</Link>
                </li>

                {estAdmin && (
                    <>
                        <li className="nav-item mb-3">
                            <Link to="/articles" className="nav-link text-white">Articles</Link>
                        </li>
                        <li className="nav-item mb-3">
                            <Link to="/categories" className="nav-link text-white">Categories</Link>
                        </li>
                    </>
                )}

                <li className="nav-item mb-3">
                    <Link to="/achats" className="nav-link text-white">Achats</Link>
                </li>

                <li className="nav-item mb-3">
                    <Link to="/ventes" className="nav-link text-white">Ventes</Link>
                </li>

                <li className="nav-item mb-3">
                    <Link to="/caisse" className="nav-link text-white">Caisse</Link>
                </li>

                <li className="nav-item mb-3">
                    <Link to="/clients" className="nav-link text-white">Clients / credits</Link>
                </li>

                {estAdmin && (
                    <>
                        <li className="nav-item mb-3">
                            <Link to="/fournisseurs" className="nav-link text-white">Fournisseurs</Link>
                        </li>
                        <li className="nav-item mb-3">
                            <Link to="/inventaire" className="nav-link text-white">Inventaire</Link>
                        </li>
                        <li className="nav-item mb-3">
                            <Link to="/utilisateurs" className="nav-link text-white">Administration</Link>
                        </li>
                    </>
                )}
            </ul>

            <button className="btn btn-outline-light w-100 mt-3" onClick={onLogout}>
                Changer role
            </button>
        </div>
    );
}

export default Sidebar;
