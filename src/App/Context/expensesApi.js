import axios from "axios";

const expensesApi = axios.create({
    baseURL: process.env.REACT_APP_EXPENSES_URL_BASE,
});

export { expensesApi };
