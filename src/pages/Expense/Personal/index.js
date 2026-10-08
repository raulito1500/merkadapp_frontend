import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { expensesApi } from "../../../lib/expensesApiClient";
import { useApiRequest } from "../../../shared/hooks/useApiRequest";
import PageTitle from "../../../shared/components/PageTitle";
import { ExpenseList } from "../ExpenseList";

function PersonalView() {
    const { request } = useApiRequest(expensesApi);
    const [expenses, setExpenses] = React.useState([]);
    const [destinations, setDestinations] = React.useState([]);

    const loadExpenses = () => {
        return expensesApi
            .get("/expenses", { params: { personal: true } })
            .then((response) => setExpenses(response.data));
    };

    React.useEffect(() => {
        request(() =>
            Promise.all([
                loadExpenses(),
                expensesApi.get("/groups").then((response) => setDestinations(response.data)),
            ])
        ).catch(() => {});
    }, []);

    const handleMove = (expense, newGroupId) => {
        request((client) =>
            client.patch(`/expenses/${expense._id}/group`, { groupId: newGroupId }).then(() => loadExpenses())
        ).catch(() => {});
    };

    return (
        <>
            <PageTitle>Personal</PageTitle>
            <Card className="my-3">
                <Card.Body className="py-2 d-flex justify-content-end">
                    <Link to="create" className="btn btn-primary text-white btn-sm">
                        Add expense
                    </Link>
                </Card.Body>
            </Card>
            <ExpenseList expenses={expenses} destinations={destinations} onMove={handleMove} />
        </>
    );
}

export { PersonalView };
