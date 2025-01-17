import React, { useMemo } from "react";

const UtilitiesContext = React.createContext();

function UtilitiesProvider({ children }) {
    const utilities = useMemo(() => ({}), []);

    return <UtilitiesContext.Provider value={utilities}>{children}</UtilitiesContext.Provider>;
}

function useUtilities() {
    return React.useContext(UtilitiesContext);
}

export { UtilitiesProvider, useUtilities };
