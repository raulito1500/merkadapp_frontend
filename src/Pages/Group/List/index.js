import React from "react";
import { Card, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context/app";
import { useAuth } from "../../../App/Context/auth";
import { expensesApi } from "../../../App/Context/expensesApi";
import { GROUP_CATEGORIES } from "../../../Constants/constants";
import PageTitle from "../../../components/PageTitle";
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
    const { setLoading, pushNotifications } = React.useContext(AppContext);
    const { user } = useAuth();
    const [groups, setGroups] = React.useState([]);

    React.useEffect(() => {
        setLoading(true);
        expensesApi
            .get("/groups")
            .then(async (response) => {
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
                setGroups(withBalances);
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
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
