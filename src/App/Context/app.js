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

    const providerValue = useMemo(() => ({
        api,
        loading,
        setLoading,
        show,
        setShow,
        notifications,
        setNotifications
    }), [api, loading, show, notifications]);

    return (
        <AppContext.Provider value={providerValue}>
            {children}
        </AppContext.Provider>)
}

export { AppContext, AppProvider }