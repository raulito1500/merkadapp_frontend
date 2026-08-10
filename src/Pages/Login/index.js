import React from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import { useAuth } from '../../App/Context/auth';
import "./index.scss";

const ERROR_MESSAGES = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/invalid-email": "That email doesn't look right.",
    "auth/too-many-requests": "Too many attempts. Please try again in a few minutes.",
    "auth/popup-closed-by-user": "The Google sign-in window was closed before finishing.",
};

function getErrorMessage(error) {
    return ERROR_MESSAGES[error?.code] ?? "Something went wrong signing in. Please try again.";
}

function Login() {
    const auth = useAuth();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState(null);
    const [submitting, setSubmitting] = React.useState(false);

    const login = async (event) => {
        event.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await auth.loginWithEmailPassword(email, password);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    }

    const loginWithGoogle = async () => {
        setError(null);
        try {
            await auth.loginWithGoogle();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    return (
        <div className="login-page d-flex flex-column justify-content-center min-vh-100 px-4">
            <div className="text-decoration-none text-white main-logo">
                <span className="full text-center d-block mb-5">Merkadapp</span>
            </div>
            <Card className="login-card border-0 rounded-top-5 rounded-bottom-5 my-4 mx-auto w-100">
                <Card.Body className="p-4 d-flex flex-column ">
                    <div className="welcome text-center mb-4">
                        <h1 className="display-1 text-primary">Welcome back</h1>
                        <p className="text-muted">Sign in to continue to Merkadapp.</p>
                    </div>
                    {error && (
                        <div className="alert alert-danger py-2" role="alert">{error}</div>
                    )}
                    <Form onSubmit={login}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-white">
                                    <i className="bi bi-person"></i>
                                </InputGroup.Text>
                                <Form.Control className="py-3" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
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
                        <Button variant="primary" type="submit" disabled={submitting} className="w-100 text-white fw-bold p-3 my-3 rounded-4">
                            Sign In <i className="bi bi-arrow-right"></i>
                        </Button>
                    </Form>
                    <hr className="my-4" />
                    <Button variant="outline-secondary" onClick={loginWithGoogle} className="w-100 d-flex align-items-center justify-content-center gap-2 p-3 rounded-4">
                        <i className="bi bi-google"></i> Continue with Google
                    </Button>
                </Card.Body>
            </Card>
        </div>
    )
}

export { Login }
