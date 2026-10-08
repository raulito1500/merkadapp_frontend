import { useCallback, useContext } from "react";
import { AppContext } from "../../app/providers/app";

function useApiRequest(client) {
    const { setLoading, pushNotifications } = useContext(AppContext);

    const request = useCallback(
        (call, { errorTitle = "¡Ups! Something went wrong", errorType = "warning" } = {}) => {
            setLoading(true);
            return call(client)
                .catch((error) => {
                    pushNotifications(errorTitle, error, errorType);
                    throw error;
                })
                .finally(() => setLoading(false));
        },
        [client, setLoading, pushNotifications]
    );

    return { request };
}

export { useApiRequest };
