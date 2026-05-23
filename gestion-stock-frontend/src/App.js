import React from "react";

import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Sidebar from "./layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import ListeArticles from "./pages/ListeArticles";
import Clients from "./pages/Clients";
import AjouterArticle from "./pages/AjouterArticle";

function App() {
    return (
        <BrowserRouter>
            <div className="d-flex">
                <Sidebar />

                <div className="flex-grow-1 bg-light min-vh-100 p-4">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/articles" element={<ListeArticles />} />
                        <Route path="/clients" element={<Clients />} />
                        <Route path="/ajouter-article" element={<AjouterArticle />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;