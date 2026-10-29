import React from "react";
import { expensesApi } from "../../../lib/expensesApiClient";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { expenseApi } from "../../expense/api/expenseApi";
import { groupApi } from "../api/groupApi";

function useGroupView(groupId) {
    const { request } = useApiRequest(expensesApi);
    const [group, setGroup] = React.useState(null);
    const [expenses, setExpenses] = React.useState([]);
    const [summary, setSummary] = React.useState([]);
    const [destinations, setDestinations] = React.useState([]);

    const loadExpenses = () => {
        return expenseApi.listByGroup(expensesApi, groupId).then((response) => setExpenses(response.data));
    };

    const loadSummary = () => {
        return groupApi.getSummary(expensesApi, groupId).then((response) => setSummary(response.data));
    };

    React.useEffect(() => {
        request(() =>
            Promise.all([
                groupApi.getById(expensesApi, groupId).then((response) => setGroup(response.data)),
                loadExpenses(),
                loadSummary(),
                groupApi
                    .list(expensesApi)
                    .then((response) => setDestinations(response.data.filter((g) => g._id !== groupId))),
            ])
        ).catch(() => {});
    }, [groupId]);

    const handleMove = (expense, newGroupId) => {
        request((client) =>
            expenseApi
                .moveToGroup(client, expense._id, newGroupId)
                .then(() => Promise.all([loadExpenses(), loadSummary()]))
        ).catch(() => {});
    };

    return { group, expenses, summary, destinations, handleMove };
}

export { useGroupView };
