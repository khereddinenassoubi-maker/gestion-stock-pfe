import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div
            className="bg-dark text-white p-3"
            style={{
                width: "250px",
                minHeight: "100vh"
            }}
        >
            <h3 className="text-center mb-4">Gestion Stock</h3>

            <ul className="nav flex-column">
                <li className="nav-item mb-3">
                    <Link to="/" className="nav-link text-white">
                        Dashboard
                    </Link>
                </li>

                <li className="nav-item mb-3">
                    <Link to="/articles" className="nav-link text-white">
                        Articles
                    </Link>
                </li>

                <li className="nav-item mb-3">
                    <Link to="/clients" className="nav-link text-white">
                        Clients
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;