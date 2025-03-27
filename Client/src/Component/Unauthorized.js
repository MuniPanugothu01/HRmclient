import React from "react";
import { FaShieldHalved } from "react-icons/fa6";
import "./Unauthorized.css";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate

const Unauthorized = () => {

    return (
        <>
            <div className="unauthorized-container">
                <FaShieldHalved className="icon-shield" />
                <h1>Access Denied</h1>
                <p>You do not have permission to view this page.</p>
                <button onClick={() => navigate(-1)}>Go Back</button>

            </div>
        </>
    );
};

export default Unauthorized;
