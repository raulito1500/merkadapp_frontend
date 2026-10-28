import React from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useAuth } from "../../../app/providers/auth";
import { expensesApi } from "../../../lib/expensesApiClient";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { expenseApi } from "../api/expenseApi";

function useExpenseForm(groupId) {
    const auth = useAuth();
    const navigate = useNavigate();
    const { request } = useApiRequest(expensesApi);

    const [group, setGroup] = React.useState(null);
    const [description, setDescription] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [currency, setCurrency] = React.useState("COP");
    const [date, setDate] = React.useState(moment().format("YYYY-MM-DD"));
    const [paidBy, setPaidBy] = React.useState(auth.user.uid);

    React.useEffect(() => {
        if (!groupId) return;
        request((client) => expenseApi.getGroup(client, groupId))
            .then((response) => {
                setGroup(response.data);
                setPaidBy(
                    response.data.members.some((member) => member.uid === auth.user.uid)
                        ? auth.user.uid
                        : response.data.members[0].uid
                );
            })
            .catch(() => {});
    }, [groupId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        request((client) =>
            expenseApi.create(client, {
                description,
                amount: Number(amount),
                currency,
                date,
                paidBy,
                groupId: groupId ?? undefined,
            })
        )
            .then(() => navigate(groupId ? `/expenses/${groupId}` : "/expenses/personal"))
            .catch(() => {});
    };

    return {
        group,
        description,
        setDescription,
        amount,
        setAmount,
        currency,
        setCurrency,
        date,
        setDate,
        paidBy,
        setPaidBy,
        handleSubmit,
    };
}

export { useExpenseForm };
