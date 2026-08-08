import React from "react";
import { Button, Form, Navbar, Row } from "react-bootstrap";
import { useAuth } from '../../App/Context/auth';


function Login() {
    const auth = useAuth();
    const [username, setUsername] = React.useState('');

    const login = (event) => {
        event.preventDefault();
        auth.login({ username });
    }

    return (
        <div className="d-flex flex-column align-items-center h-100 min-vh-100 vh-100">
            <div className="form-signin w-100 h-50 m-auto p-5">
                <form onSubmit={login}>
                    <Row>
                        <Navbar.Brand href="/" className="text-decoration-none text-white main-logo order-md-2">
                            <img src="logo.svg" className="me-2" alt="Merkadapp logo" />
                            <span className="short"></span>
                            <span className="full fs-2">Merkadapp</span>
                        </Navbar.Brand>
                    </Row>
                    <Row className="">
                        <h1>¡Welcome!</h1>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control />
                        </Form.Group>
                    </Row>
                    <Row>
                        <Button type="submit">Sign in</Button>
                    </Row>
                </form>
            </div>
        </div >

    )
}

export { Login }