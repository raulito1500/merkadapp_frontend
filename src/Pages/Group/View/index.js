import React from "react";
import { Card, ListGroup, Row } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../../../App/Context/app";
import { useAuth } from "../../../App/Context/auth";
import { expensesApi } from "../../../App/Context/expensesApi";
import Avatar from "../../../components/Avatar";
import PageTitle from "../../../components/PageTitle";
import { formatMoney } from "../../../utils/formatting";
import { computeSettlements } from "../../../utils/settlements";
import { displayNameOf } from "../../../utils/userDisplay";
import { ExpenseList } from "../../Expense/ExpenseList";

const BALANCE_EPSILON = 0.01;

function GroupView() {
    const { groupId } = useParams();
    const { setLoading, pushNotifications } = React.useContext(AppContext);
    const { user } = useAuth();
    const [group, setGroup] = React.useState(null);
    const [expenses, setExpenses] = React.useState([]);
    const [summary, setSummary] = React.useState([]);
    const [destinations, setDestinations] = React.useState([]);

    const loadExpenses = () => {
        return expensesApi.get("/expenses", { params: { groupId } }).then((response) => {
            setExpenses(response.data);
        });
    };

    const loadSummary = () => {
        return expensesApi.get(`/groups/${groupId}/summary`).then((response) => {
            setSummary(response.data);
        });
    };

    React.useEffect(() => {
        setLoading(true);
        Promise.all([
            expensesApi.get(`/groups/${groupId}`).then((response) => setGroup(response.data)),
            loadExpenses(),
            loadSummary(),
            expensesApi
                .get("/groups")
                .then((response) => setDestinations(response.data.filter((g) => g._id !== groupId))),
        ])
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, [groupId]);

    const handleMove = (expense, newGroupId) => {
        setLoading(true);
        expensesApi
            .patch(`/expenses/${expense._id}/group`, { groupId: newGroupId })
            .then(() => Promise.all([loadExpenses(), loadSummary()]))
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <PageTitle>{group ? group.name : "Grupo"}</PageTitle>
            <Row className="mb-3">
                <Link to="edit" className="btn btn-outline-primary btn-sm">
                    <i className="bi bi-pencil"></i> Edit
                </Link>
                <Link to="create" className="btn btn-outline-secondary btn-sm mb-3">
                    <i className="bi bi-plus"></i> Add expense
                </Link>
            </Row>
            {summary.map((currencySummary) => {
                const membersByUid = new Map(currencySummary.members.map((member) => [member.user.uid, member.user]));
                const currentMember = currencySummary.members.find((member) => member.user.uid === user.uid);
                const otherMembers = currencySummary.members.filter((member) => member.user.uid !== user.uid);
                const settlements = computeSettlements(
                    currencySummary.members.map((member) => ({ uid: member.user.uid, balance: member.balance }))
                );
                const nameOrYou = (uid) => (uid === user.uid ? "you" : displayNameOf(membersByUid.get(uid)));

                const viewerDebts = settlements.filter((settlement) => settlement.from === user.uid);
                const currentBalance = currentMember?.balance ?? 0;
                const isSettled = Math.abs(currentBalance) <= BALANCE_EPSILON;
                let title;
                if (isSettled) {
                    title = "Settled";
                } else if (viewerDebts.length === 1) {
                    title = `You owe ${nameOrYou(viewerDebts[0].to)} ${formatMoney(viewerDebts[0].amount)}`;
                } else if (currentBalance < 0) {
                    title = `You owe ${formatMoney(Math.abs(currentBalance))}`;
                } else {
                    title = `They owe you ${formatMoney(currentBalance)}`;
                }

                return (
                    <Card className="mb-3" key={currencySummary.currency}>
                        <Card.Body>
                            <h3
                                className={`fs-5 mb-3 ${isSettled ? "" : currentBalance < 0 ? "text-danger" : "text-success"
                                    }`}
                            >
                                {title} <span className="text-muted small fw-normal">{currencySummary.currency}</span>
                            </h3>
                            <ListGroup variant="flush">
                                {otherMembers.map((member) => {
                                    const memberSettled = Math.abs(member.balance) <= BALANCE_EPSILON;
                                    const rows = memberSettled
                                        ? [{ key: "settled", label: "Settled", amount: null }]
                                        : member.balance > 0
                                            ? [{ key: "credit", label: "Gets back", amount: member.balance, positive: true }]
                                            : settlements
                                                .filter((settlement) => settlement.from === member.user.uid)
                                                .map((settlement) => ({
                                                    key: settlement.to,
                                                    label: `Owes ${nameOrYou(settlement.to)}`,
                                                    amount: settlement.amount,
                                                    positive: false,
                                                }));
                                    return (
                                        <ListGroup.Item
                                            key={member.user.uid}
                                            className="d-flex justify-content-between align-items-start px-0"
                                        >
                                            <span className="d-flex align-items-center gap-2">
                                                <Avatar user={member.user} size={24} />
                                                {displayNameOf(member.user)}
                                            </span>
                                            <div className="text-end">
                                                {rows.map((row) => (
                                                    <div key={row.key} className="mb-1">
                                                        <span className="text-muted small d-block">{row.label}</span>
                                                        {row.amount !== null && (
                                                            <>
                                                                <strong
                                                                    className={row.positive ? "text-success" : "text-danger"}
                                                                >
                                                                    {formatMoney(row.amount)}
                                                                </strong>{" "}
                                                                <span className="text-muted small">
                                                                    {currencySummary.currency}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                );
            })}
            <ExpenseList expenses={expenses} destinations={destinations} onMove={handleMove} />
        </>
    );
}

export { GroupView };
