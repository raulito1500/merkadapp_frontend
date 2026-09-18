import React from "react";
import axios from "axios";
import { auth } from "./firebaseConfig";

const api = axios.create({
    baseURL: process.env.REACT_APP_URL_BASE,
});

api.interceptors.request.use(async (config) => {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const useGetApi = (url) => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        setLoading(true);
        api.get(url)
            .then((response) => {
                setData(response.data);
            })
            .catch((err) => {
                setError(err);
            })
            .finally(() => setLoading(false));
    }, [url]);

    return { data, loading, error };
};
export { api, useGetApi };
