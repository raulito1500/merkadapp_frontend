import React from "react";
import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AppNavBar } from "../../AppNavbar";

function MainLayout(){
    return (
        <div className="d-flex flex-column h-100">
            <Container className="main-layout flex-grow-1">
                <Outlet />
            </Container>
            <div className="fixed-bottom shadow-lg bg-white">
                <AppNavBar />
            </div>
        </div>
    );
};

export default MainLayout;
