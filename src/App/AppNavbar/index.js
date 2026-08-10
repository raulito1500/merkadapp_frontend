import React from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./index.scss";
import { useAuth } from "../Context/auth";

const routes = [
    { to: "/", icon: "bi bi-house", icon_active: "bi bi-house-fill", text: "Overview", private: false },
    { to: "bills", icon: "bi bi-receipt", icon_active: "bi bi-receipt", text: "Bills", private: false },
    { to: "products", icon: "bi bi-tags", icon_active: "bi bi-tags-fill", text: "Products", private: false },
    { to: "expenses", icon: "bi bi-cash-coin", icon_active: "bi bi-cash-coin", text: "Expenses", private: false },
];

function initials(user) {
    const source = user.displayName || user.email || "";
    return source.charAt(0).toUpperCase();
}

function AppNavBar() {
    const auth = useAuth();
    const [photoFailed, setPhotoFailed] = React.useState(false);
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
                    <Dropdown className="nav-avatar w-100 text-center" drop="up">
                        <Dropdown.Toggle variant="none" className="nav-avatar-toggle" id="dropdownUser">
                            {auth.user.photoURL && !photoFailed ? (
                                <img
                                    src={auth.user.photoURL}
                                    alt={auth.user.displayName ?? auth.user.email}
                                    width="28"
                                    height="28"
                                    className="rounded-circle"
                                    referrerPolicy="no-referrer"
                                    onError={() => setPhotoFailed(true)}
                                />
                            ) : (
                                <span className="nav-avatar-fallback rounded-circle border">{initials(auth.user)}</span>
                            )}
                            <span>Profile</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end">
                            <Dropdown.Item onClick={() => auth.logout()}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar>
    );
}

export { AppNavBar };
