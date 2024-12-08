import React, { useState } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { AppContext } from "../Context/app";

function Notifications() {
    // TODO: Manejar el estado para cada una de las notificaciones
    const [show, setShow] = useState(true);

    const DELAY = 10000;

    const {
        notifications
    } = React.useContext(AppContext);

    return (
        <ToastContainer
            className="pt-5"
            position="top-end"
        >
            {notifications ? notifications.map((item, index) => (
                <Toast
                    key={index}
                    bg={item.type}
                    onClose={() => setShow(false)}
                    show={show}
                    autohide
                    animation={true}
                    delay={DELAY}
                >
                    <Toast.Header>
                        <strong className="me-auto">{item.title}</strong>
                    </Toast.Header>
                    <Toast.Body>
                        {item.content}
                    </Toast.Body>
                </Toast>
            )) : ""}

        </ToastContainer>
    )
}
export { Notifications };