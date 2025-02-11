import React from "react";
import { AppContext } from "../Context/app";
import { Spinner } from "react-bootstrap";
import "./index.scss";

function Loader() {
    const { loading } = React.useContext(AppContext);
    return (
        loading && (
            <>
                <div className="loader-backdrop show"></div>
                <div className="loader-spinner-container position-fixed top-50 start-50 translate-middle">
                    <Spinner
                        animation="border"
                        variant="primary"
                        role="status"
                        className="loader-spinner"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            </>
        )
    );
}

export default Loader;
