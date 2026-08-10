import axios from "axios";
import { auth } from "./firebaseConfig";

const expensesApi = axios.create({
    baseURL: process.env.REACT_APP_EXPENSES_URL_BASE,
});

expensesApi.interceptors.request.use(async (config) => {
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export { expensesApi };
