import React from "react";
import { Button } from "react-bootstrap";
import { useAuth } from '../../App/Context/auth';

function Logout() {

    const auth = useAuth();

    const logout = (event) => {
        event.preventDefault();
        auth.logout();
    }

    return (
        <><h1>Logout</h1>
        <form onSubmit={logout}>
            <label>¿Sure?: </label>
            <Button type="submit">Yes</Button>
        </form></>
    )
}

export { Logout }