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

    const notificationType = (type) => {
        if (type === "") {
            return "light";
        }
        if (type === "error") {
            return "danger";
        }
        if (type === "warning") {
            return "warning";
        }
        return "default";
    }

    const timeAgo = (timestamp) => {
        const now = new Date();
        const seconds = Math.floor((now - new Date(timestamp)) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'} ago`;
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'} ago`;
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'} ago`;
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'} ago`;
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'} ago`;
        return 'Just now';
    };

    return (
        <ToastContainer
            className="pt-2 position-fixed top-0 start-50 translate-middle-x"
        >
            {notifications && notifications.map((item) => (
                <Toast
                    className={`border-0 border-start border-5 bg-white border-${notificationType(item.type)}`}
                    key={item.id}
                    onClose={() => handleClose(item.id)}
                    show={true}
                    autohide
                    animation={true}
                    delay={DELAY}
                >
                    <Toast.Header
                        className="bg-transparent border-0">
                        <strong className="me-auto">{item.title}</strong>
                        <small>{timeAgo(item.timestamp)}</small>
                    </Toast.Header>
                    <Toast.Body
                        className="px-3 pt-0 pb-3">
                        {item.content}
                    </Toast.Body>
                </Toast>
            ))}
        </ToastContainer>
    );
}

export { Notifications };