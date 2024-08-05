import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();
    useEffect( () => {
        const prevPath = localStorage.getItem("prevPath")
        if (typeof(prevPath) === 'string') {
            if (prevPath.trim() === '/topbar') {
                localStorage.removeItem("prevPath")
                navigate("/");
            }
        }
    },[navigate])

    const goBack = () => navigate(-1);

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <h1 className="display-1 fw-bold">403</h1>
                    <p className="fs-3"> <span className="text-danger">Unauthorized</span></p>
                    <p className="lead">
                        Sorry, you are not authorized to access this page.
                    </p>
                    <button className="btn btn-primary btn-lg" onClick={goBack}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
