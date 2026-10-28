import React from "react";
import { expensesApi } from "../../../lib/expensesApiClient";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { expenseApi } from "../api/expenseApi";

function usePersonalExpenses() {
    const { request } = useApiRequest(expensesApi);
    const [expenses, setExpenses] = React.useState([]);
    const [destinations, setDestinations] = React.useState([]);

    const loadExpenses = () => {
        return expenseApi.listPersonal(expensesApi).then((response) => setExpenses(response.data));
    };

    React.useEffect(() => {
        request(() =>
            Promise.all([
                loadExpenses(),
                expenseApi.listGroups(expensesApi).then((response) => setDestinations(response.data)),
            ])
        ).catch(() => {});
    }, []);

    const handleMove = (expense, newGroupId) => {
        request((client) => expenseApi.moveToGroup(client, expense._id, newGroupId).then(() => loadExpenses()))
            .catch(() => {});
    };

    return { expenses, destinations, handleMove };
}

export { usePersonalExpenses };
