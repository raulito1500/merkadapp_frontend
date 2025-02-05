import React from "react";
import { Link } from "react-router-dom";

const PageTitle = ({ children }) => {
    return (
        <h1>
            <Link to={-1}>
                <i className="bi bi-arrow-left fs-5"></i>
            </Link>
            {children}
        </h1>
    );
};

export default PageTitle;
