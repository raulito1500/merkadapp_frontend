import React from "react";
import { useAuth } from "../../../app/providers/auth";
import { expensesApi } from "../../../lib/expensesApiClient";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { groupApi } from "../api/groupApi";

function balancesForUser(summary, uid) {
    return summary
        .map((currencySummary) => {
            const member = currencySummary.members.find((m) => m.user.uid === uid);
            return member ? { currency: currencySummary.currency, amount: member.balance } : null;
        })
        .filter(Boolean);
}

function useGroupList() {
    const { request } = useApiRequest(expensesApi);
    const { user } = useAuth();
    const [groups, setGroups] = React.useState([]);

    React.useEffect(() => {
        request((client) =>
            groupApi.list(client).then(async (response) => {
                const rawGroups = response.data;
                const summaries = await Promise.all(
                    rawGroups.map((group) => groupApi.getSummary(expensesApi, group._id))
                );
                const withBalances = rawGroups.map((group, index) => {
                    const balances = balancesForUser(summaries[index].data, user.uid);
                    const sortKey = balances.reduce((sum, balance) => sum + balance.amount, 0);
                    return { ...group, balances, sortKey };
                });
                withBalances.sort((a, b) => b.sortKey - a.sortKey);
                return withBalances;
            })
        )
            .then((withBalances) => setGroups(withBalances))
            .catch(() => {});
    }, []);

    return { groups };
}

export { useGroupList };
