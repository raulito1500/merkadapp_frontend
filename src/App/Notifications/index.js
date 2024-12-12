import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { AppContext } from "../Context/app";

function Notifications() {
    const DELAY = 5000;

    const { notifications, setNotifications } = React.useContext(AppContext);

    const handleClose = (id) => {
        setNotifications((prevNotifications) => {
            return prevNotifications.filter((item) => item.id !== id);
        });
    };

    return (
        <ToastContainer
            className="pt-2 position-fixed top-0 start-50 translate-middle-x"
        >
            {notifications && notifications.map((item) => (
                <Toast
                    key={item.id}
                    bg={item.type}
                    onClose={() => handleClose(item.id)}
                    show={true}
                    autohide
                    animation={true}
                    delay={DELAY}
                >
                    <Toast.Header>
                        <strong className="me-auto">{item.title}</strong>
                    </Toast.Header>
                    {item.content && <Toast.Body>
                        {item.content}
                    </Toast.Body>}
                </Toast>
            ))}
        </ToastContainer>
    );
}

export { Notifications };