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

    const pushNotifications = (title, error, type = "") => {
        let errorMessage;
        if (error)
            errorMessage = error.response ? error.response.data.message : error.message;
        else
            errorMessage = ""

        const newNotification = {
            id: Date.now(),
            title: title,
            content: errorMessage,
            type: type,
            timestamp: Date.now()
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
        setNotifications,
        pushNotifications
    }), [api, loading, show, notifications]);

    return (
        <AppContext.Provider value={providerValue}>
            {children}
        </AppContext.Provider>)
}

export { AppContext, AppProvider }