import React from "react";
import { Alert } from "react-bootstrap";

function NotFound(){
    return (
        <Alert key="info" variant="info">¡Lo sentimos! No hemos podido resolver la ruta solicitada</Alert>
    )
}

export { NotFound }