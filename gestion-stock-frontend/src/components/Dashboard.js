import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        chargerArticles();
    }, []);

    const chargerArticles = () => {

        axios.get("http://localhost:8080/api/articles")
            .then(response => {
                setArticles(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const totalArticles = articles.length;

    const stockFaible = articles.filter(
        article => article.quantiteStock <= article.seuilStock
    ).length;

    const stockDisponible = articles.filter(
        article => article.quantiteStock > article.seuilStock
    ).length;

    const valeurStock = articles.reduce(
        (total, article) =>
            total + (article.prixAchat * article.quantiteStock),
        0
    );

    return (

        <div className="container mt-5">

            <h2 className="mb-4 fw-bold">
                Tableau de bord
            </h2>

            <div className="row g-4">

                <div className="col-md-3">

                    <div className="card shadow border-0 bg-primary text-white">

                        <div className="card-body">

                            <h5>Total Articles</h5>

                            <h1>{totalArticles}</h1>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow border-0 bg-success text-white">

                        <div className="card-body">

                            <h5>Articles Disponibles</h5>

                            <h1>{stockDisponible}</h1>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow border-0 bg-danger text-white">

                        <div className="card-body">

                            <h5>Stock Faible</h5>

                            <h1>{stockFaible}</h1>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card shadow border-0 bg-dark text-white">

                        <div className="card-body">

                            <h5>Valeur du Stock</h5>

                            <h3>{valeurStock.toFixed(2)} DT</h3>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;