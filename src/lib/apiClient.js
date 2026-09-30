import axios from "axios";
import { auth } from "./firebase";

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

export { api };
