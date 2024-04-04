import React from "react";

const AppContext = React.createContext();

function AppProvider({ children }) {
    const [loading, setLoading] = React.useState(false);
    return (
        <AppContext.Provider value={{
            loading,
            setLoading
        }}>
            {children}
        </AppContext.Provider>)
}

export { AppContext, AppProvider }