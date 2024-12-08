import React, { useMemo } from "react";
import axios from "axios";

const AppContext = React.createContext();

function AppProvider({ children }) {

    const [loading, setLoading] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [notifications, setNotifications] = React.useState([]);

    const api = axios.create({
        baseURL: process.env.REACT_APP_URL_BASE,
    });

    const pushNotifications = (title, message, type = "") => {
        let notificationType;
        switch (type) {
            case "":
                notificationType = "light";
                break;
            case "error":
                notificationType = "danger-subtle";
                break;
            case "warning":
                notificationType = "warning-subtle";
                break;
            default:
                break;
        }

        const newNotification = {
            title: title,
            content: message,
            type: notificationType,
            open: true,
            timestamp: new Date().toLocaleTimeString()
        };

        setNotifications(prevNotifications => [
            ...prevNotifications,
            newNotification,
        ]);
    }

    const providerValue = useMemo(() => ({
        api,
        loading,
        setLoading,
        show,
        setShow,
        notifications,
        pushNotifications
    }), [api, loading, show, notifications]);

    return (
        <AppContext.Provider value={providerValue}>
            {children}
        </AppContext.Provider>)
}

export { AppContext, AppProvider }