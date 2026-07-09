import React, { useState } from "react";

import {
    BrowserRouter,
    Navigate,
    Route,
    Routes
} from "react-router-dom";

import Sidebar from "./layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import ListeArticles from "./pages/ListeArticles";
import Clients from "./pages/Clients";
import Fournisseurs from "./pages/Fournisseurs";
import AjouterArticle from "./pages/AjouterArticle";
import Categories from "./pages/Categories";
import Achats from "./pages/Achats";
import Ventes from "./pages/Ventes";
import Utilisateurs from "./pages/Utilisateurs";
import ChoixRole from "./pages/ChoixRole";
import Caisse from "./pages/Caisse";
import Inventaire from "./pages/Inventaire";

function App() {
    const [role, setRole] = useState(localStorage.getItem("roleUtilisateur") || "");
    const [nomUtilisateur, setNomUtilisateur] = useState(localStorage.getItem("nomUtilisateur") || "");

    const choisirRole = (nouveauRole, nom) => {
        localStorage.setItem("roleUtilisateur", nouveauRole);
        localStorage.setItem("nomUtilisateur", nom);
        setRole(nouveauRole);
        setNomUtilisateur(nom);
    };

    const deconnecter = () => {
        localStorage.removeItem("roleUtilisateur");
        localStorage.removeItem("nomUtilisateur");
        setRole("");
        setNomUtilisateur("");
    };

    const adminSeulement = (element) => role === "ADMIN" ? element : <Navigate to="/" replace />;

    if (!role) {
        return <ChoixRole onChoisirRole={choisirRole} />;
    }

    return (
        <BrowserRouter>
            <div className="d-flex">
                <Sidebar role={role} nomUtilisateur={nomUtilisateur} onLogout={deconnecter} />

                <div className="flex-grow-1 bg-light min-vh-100 p-4">
                    <Routes>
                        <Route path="/" element={<Dashboard role={role} nomUtilisateur={nomUtilisateur} />} />
                        <Route path="/ventes" element={<Ventes />} />
                        <Route path="/caisse" element={<Caisse role={role} nomUtilisateur={nomUtilisateur} />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/articles" element={adminSeulement(<ListeArticles />)} />
                        <Route path="/fournisseurs" element={adminSeulement(<Fournisseurs />)} />
                        <Route path="/ajouter-article" element={adminSeulement(<AjouterArticle />)} />
                        <Route path="/categories" element={adminSeulement(<Categories />)} />
                        <Route path="/achats" element={<Achats />} />
                        <Route path="/inventaire" element={adminSeulement(<Inventaire />)} />
                        <Route path="/utilisateurs" element={adminSeulement(<Utilisateurs />)} />
                        <Route path="/modifier-article/:id" element={adminSeulement(<AjouterArticle />)} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
