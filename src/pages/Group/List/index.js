import React from "react";
import { Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../../../app/providers/auth";
import { expensesApi } from "../../../lib/expensesApiClient";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import { GROUP_CATEGORIES } from "../../../shared/constants/constants";
import PageTitle from "../../../shared/components/PageTitle";
import GroupCard from "./GroupCard";

function balancesForUser(summary, uid) {
    return summary
        .map((currencySummary) => {
            const member = currencySummary.members.find((m) => m.user.uid === uid);
            return member ? { currency: currencySummary.currency, amount: member.balance } : null;
        })
        .filter(Boolean);
}

function GroupList() {
    const { request } = useApiRequest(expensesApi);
    const { user } = useAuth();
    const [groups, setGroups] = React.useState([]);

    React.useEffect(() => {
        request((client) =>
            client.get("/groups").then(async (response) => {
                const rawGroups = response.data;
                const summaries = await Promise.all(
                    rawGroups.map((group) => expensesApi.get(`/groups/${group._id}/summary`))
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

    return (
        <>
            <PageTitle>Expenses</PageTitle>
            <Card className="my-3">
                <Card.Body className="py-2 d-flex justify-content-between align-items-center">
                    <span>Groups</span>
                    <Link to="create" className="btn btn-primary text-white btn-sm">
                        Create group
                    </Link>
                </Card.Body>
            </Card>
            <Row className="px-2">
                <GroupCard to="personal" icon="bi-lock" name="Personal" />
                {groups.map((group) => (
                    <GroupCard
                        key={group._id}
                        to={group._id}
                        icon={(GROUP_CATEGORIES[group.category] ?? GROUP_CATEGORIES.OTHER).icon}
                        name={group.name}
                        members={group.members}
                        balances={group.balances}
                    />
                ))}
            </Row>
            {groups.length === 0 && (
                <span className="text-muted px-2">You don't belong to any group yet</span>
            )}
        </>
    );
}

export { GroupList };
