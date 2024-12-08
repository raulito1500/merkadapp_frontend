import React, { useMemo } from "react";

const UtilitiesContext = React.createContext();

function UtilitiesProvider({ children }) {

    const formatMoney = (number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    const utilities = useMemo(() => ({
        formatMoney
    }), []);

    return (
        <UtilitiesContext.Provider value={utilities}>
            {children}
        </UtilitiesContext.Provider>
    );
}

function useUtilities() {
    return React.useContext(UtilitiesContext);
}

export { UtilitiesProvider, useUtilities }

