import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./index.scss";
import { useAuth } from "../Context/auth";

const routes = [
    { to: "/", icon: "bi bi-house", icon_active: "bi bi-house-fill", text: "Overview", private: false },
    { to: "bills", icon: "bi bi-receipt", icon_active: "bi bi-receipt", text: "Bills", private: false },
    { to: "products", icon: "bi bi-tags", icon_active: "bi bi-tags-fill", text: "Products", private: false },
    { to: "expenses", icon: "bi bi-cash-coin", icon_active: "bi bi-cash-coin", text: "Expenses", private: false },
    { to: "logout", icon: "bi bi-person", icon_active: "bi bi-person-fill", text: "Profile", private: false },
];


function AppNavBar() {
    const auth = useAuth();
    return (
        <Navbar className="shadow-lg">
            <Container fluid>
                <Nav className="d-flex align-items-end justify-content-around w-100">
                    {routes.map((route, index) => {
                        if (route.private && !auth.isAuthenticated()) return null;
                        else {
                            return (
                                <NavLink key={index} to={route.to} className="w-100" viewTransition>
                                    {({ isActive }) => (
                                        <>
                                            <i className={isActive ? route.icon_active : route.icon}></i>
                                            <span>{route.text}</span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        }
                    })}
                </Nav>
            </Container>
        </Navbar>
    );
}

export { AppNavBar };
