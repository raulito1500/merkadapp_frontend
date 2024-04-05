import React from "react";

const AppContext = React.createContext();

function AppProvider({ children }) {
    const [loading, setLoading] = React.useState(false);
    const [show, setShow] = React.useState(false);

    return (
        <AppContext.Provider value={{
            loading,
            setLoading,
            show,
            setShow
        }}>
            {children}
        </AppContext.Provider>)
}

export { AppContext, AppProvider }