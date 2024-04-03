import { Container, Dropdown } from "react-bootstrap"
import { NavLink } from "react-router-dom"

const routes = [
    { to: "/", text: "Overview" },
    { to: "/bills", text: "Bills" },
];

function AppHeader() {
    const classNameForLink = (isActive) => {
        return isActive ? "nav-link px-2 link-secondary" : "nav-link px-2 link-dark";
    }
    return (
        <header className="p-3 mb-3 border-bottom">
            <Container>
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="32"
                            role="img"
                            aria-label="Merkadapp"
                            fill="currentColor"
                            className="bi bi-cart4"
                            viewBox="0 0 16 16">
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                        </svg>
                    </a>
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                        {routes.map((route, index) => (
                            <li
                                key={index}>
                                <NavLink
                                    to={route.to}
                                    className={({ isActive }) => classNameForLink(isActive)}>
                                    {route.text}</NavLink></li>
                        ))}
                    </ul>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="none"
                            className="d-block link-dark text-decoration-none dropdown-toggle"
                            id="dropdownUser1">
                            <img src="https://avatars.githubusercontent.com/u/817891?v=4" alt="mdo" width="32" height="32" className="rounded-circle" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Profile</Dropdown.Item>
                            <Dropdown.Item>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Container>
        </header >
    )
}

export { AppHeader }