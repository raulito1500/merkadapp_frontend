import React from "react";
import { Button, Card, Form, InputGroup, Row } from "react-bootstrap";
import { useAuth } from '../../App/Context/auth';
import "./index.scss";

function Login() {
    const auth = useAuth();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const login = (event) => {
        event.preventDefault();
        auth.login({ username });
    }

    return (
        <div className="login-page d-flex flex-column justify-content-center min-vh-100">
            <div className="text-decoration-none text-white main-logo">
                <span className="full text-center d-block mb-5">Merkadapp</span>
            </div>
            <Card className="login-card border-0 rounded-top-5 rounded-bottom-5 m-4">
                <Card.Body className="p-4 d-flex flex-column ">
                    <div className="welcome text-center mb-4">
                        <h1 className="display-1 text-primary">Welcome back</h1>
                        <p className="text-muted">Sign in to continue to Merkadapp.</p>
                    </div>
                    <Form onSubmit={login}>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-white">
                                    <i className="bi bi-person"></i>
                                </InputGroup.Text>
                                <Form.Control className="py-3" type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <div className="d-flex justify-content-between align-items-center">
                                <Form.Label>Password</Form.Label>
                                <a href="/forgot-password" className="small">Forgot password?</a>
                            </div>
                            <InputGroup className="mb-3">
                                <InputGroup.Text className="bg-white">
                                    <i className="bi bi-lock"></i>
                                </InputGroup.Text>
                                <Form.Control className="py-3 border-end-0" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                <InputGroup.Text className="border-end border-start-0" role="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>
                                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicCheckbox">
                            <Form.Check type="checkbox" label="Remember me" />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 text-white fw-bold p-3 my-3 rounded-4">
                            Sign In <i className="bi bi-arrow-right"></i>
                        </Button>
                    </Form>
                    <hr className="my-4" />
                    <div className="text-center mt-3">
                        Don't have an account? <a href="/register" className="text-primary fw-bold">Sign up</a>
                    </div>
                </Card.Body>
            </Card>
        </div>
    )
}

export { Login }
