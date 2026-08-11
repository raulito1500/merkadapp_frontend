import React from "react";
import { Badge, Card, Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { AppContext } from "../../../App/Context/app";
import { expensesApi } from "../../../App/Context/expensesApi";
import PageTitle from "../../../components/PageTitle";
import { formatMoney } from "../../../utils/formatting";
import { displayNameOf } from "../../../utils/userDisplay";
import { ExpenseList } from "../../Expense/ExpenseList";

function GroupView() {
    const { groupId } = useParams();
    const { setLoading, pushNotifications } = React.useContext(AppContext);
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
            <Card className="my-3">
                <Card.Body className="py-2 d-flex justify-content-between align-items-center">
                    <span>{group?.members.map((member) => displayNameOf(member)).join(", ")}</span>
                    <Link to="create" className="btn btn-primary text-white btn-sm">
                        Add expense
                    </Link>
                </Card.Body>
            </Card>
            {summary.map((currencySummary) => (
                <Card className="mb-3" key={currencySummary.currency}>
                    <Card.Body>
                        <h3 className="fs-6">
                            Summary ({currencySummary.currency}) — Total {formatMoney(currencySummary.total)}
                        </h3>
                        <Table size="sm" borderless className="mb-0">
                            <tbody>
                                {currencySummary.members.map((member) => (
                                    <tr key={member.user.uid}>
                                        <td>{displayNameOf(member.user)}</td>
                                        <td className="text-muted">{formatMoney(member.paid)} paid</td>
                                        <td className="text-end">
                                            <Badge bg={member.balance >= 0 ? "success" : "danger"}>
                                                {member.balance >= 0
                                                    ? `They owe ${formatMoney(member.balance)}`
                                                    : `Owes ${formatMoney(Math.abs(member.balance))}`}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            ))}
            <ExpenseList expenses={expenses} destinations={destinations} onMove={handleMove} />
        </>
    );
}

export { GroupView };
