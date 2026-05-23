import React from "react";

function Dashboard() {
    return (
        <div className="container mt-4">
            <div className="row">

                <div className="col-md-4">
                    <div className="card bg-primary text-white shadow">
                        <div className="card-body">
                            <h5>Total Articles</h5>
                            <h2>25</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card bg-success text-white shadow">
                        <div className="card-body">
                            <h5>Articles Disponibles</h5>
                            <h2>20</h2>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card bg-danger text-white shadow">
                        <div className="card-body">
                            <h5>Stock Faible</h5>
                            <h2>5</h2>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;