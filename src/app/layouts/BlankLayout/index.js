import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

function BlankLayout() {
    return (
        <div className="d-flex flex-column h-100">
            <Container className="flex-grow-1 pt-4">
                <Outlet />
            </Container>
        </div>
    );
};

export default BlankLayout;
