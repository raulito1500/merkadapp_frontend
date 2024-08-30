import React from "react";
import { AppContext } from "../Context";
import { NavLink } from "react-router-dom"
import { Container, Dropdown, Nav, Navbar, Spinner } from "react-bootstrap"
import { useAuth } from "../Context/auth";

const routes = [
    { to: "/", text: "Overview", private: false },
    { to: "/bills", text: "Bills", private: false },
];

function AppHeader() {
    const auth = useAuth();
    const {
        loading
    } = React.useContext(AppContext);

    return (
        <div className="shadowHeader">
            <header className="pt-4 pt-sm-1 pb-4 mb-3 bg-primary">
                <Navbar expand="md">
                    <Container>
                        <Navbar.Toggle aria-controls="main-nav-bar" className="text-white border-0 order-md-1" >
                            <i class="bi bi-list"></i>
                        </Navbar.Toggle>
                        <Navbar.Brand href="/" className="text-decoration-none text-white main-logo order-md-2">
                            <img src="logo.svg" className="me-2" alt="Merkadapp logo" />
                            <span className="short"></span>
                            <span className="full fs-2">Merkadapp</span>
                        </Navbar.Brand>
                        {auth.user ? <Dropdown className="order-md-4">
                            <Dropdown.Toggle
                                variant="none"
                                className="d-block link-light text-decoration-none dropdown-toggle"
                                id="dropdownUser1">
                                <img src={`https://avatars.githubusercontent.com/u/${auth.gitHubID}?v=4`} alt="mdo" width="32" height="32" className="rounded-circle" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item><NavLink to='/logout'>Logout</NavLink></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown> :
                            <NavLink
                                to="/login"
                                className="btn btn-outline-light order-md-4">Log in</NavLink>
                        }
                        <Navbar.Collapse id="main-nav-bar" className="order-md-3">
                            <Nav className="d-flex flex-grow-0 align-items-center">
                                <div className="d-flex flex-row justify-content-center mt-3 mb-3 p-2 mb-0 bg-white-25 rounded-3">
                                    {routes.map((route, index) => {
                                        if (route.private && !auth.isAuthenticated()) return null;
                                        else {
                                            return (
                                                <NavLink
                                                    to={route.to}
                                                    className="nav-link px-2 link-light">
                                                    {route.text}</NavLink>
                                            )
                                        }
                                    }
                                    )}
                                </div>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                {loading ? <Spinner
                    animation="border"
                    variant="primary"
                    role="status" className="position-fixed bottom-0 end-50 z-3">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : ""}
            </header >
        </div>
    )
}

export { AppHeader }