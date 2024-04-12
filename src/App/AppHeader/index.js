import React from "react";
import { AppContext } from "../Context";
import { NavLink } from "react-router-dom"
import { Container, Dropdown, Spinner } from "react-bootstrap"
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
        <header className="pt-4 pt-sm-1 pb-4 mb-3 bg-primary">
            <Container>
                <div className="d-flex flex-column align-items-center flex-sm-row justify-content-sm-between" >
                    <a href="/" className="d-flex align-items-start text-decoration-none text-white main-logo">
                        <img src="logo.svg" className="me-2" alt="Merkadapp logo" />
                        <span className="fs-2">Merkadapp</span>
                    </a>
                    <ul className="nav mt-3 mb-3 p-2 mb-0 bg-white-25 rounded-3">
                        {routes.map((route, index) => {
                            if (route.private && !auth.isAuthenticated()) return null;
                            else {
                                return (
                                    <li
                                        key={index}>
                                        <NavLink
                                            to={route.to}
                                            className="nav-link px-2 link-light">
                                            {route.text}</NavLink></li>
                                )
                            }
                        }
                        )}
                    </ul>
                    {loading ? <Spinner
                        animation="border"
                        role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner> : ""}
                    {auth.user ? <Dropdown>
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
                            className="btn btn-outline-light">Log in</NavLink>
                    }
                </div>
            </Container>
        </header >
    )
}

export { AppHeader }