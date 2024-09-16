import React from "react";
import { Button } from "react-bootstrap";
import { useAuth } from '../../App/Context/auth';


function Login() {
    const auth = useAuth();
    const [username, setUsername] = React.useState('');

    const login = (event) => {
        event.preventDefault();
        auth.login({username});
    }

    return (
        <><h1>Login</h1>
            <form onSubmit={login}>
                <label>Username: </label>
                <input
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <Button type="submit">Login</Button>
            </form></>
    )
}

export { Login }