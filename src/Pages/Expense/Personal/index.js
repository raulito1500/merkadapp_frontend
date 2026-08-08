import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AppContext } from "../../../App/Context/app";
import { useAuth } from "../../../App/Context/auth";
import { expensesApi } from "../../../App/Context/expensesApi";
import PageTitle from "../../../components/PageTitle";
import { ExpenseList } from "../ExpenseList";

function PersonalView() {
    const auth = useAuth();
    const { setLoading, pushNotifications } = React.useContext(AppContext);
    const [expenses, setExpenses] = React.useState([]);
    const [destinations, setDestinations] = React.useState([]);

    const loadExpenses = () => {
        return expensesApi
            .get("/expenses", { params: { owner: auth.user, personal: true } })
            .then((response) => setExpenses(response.data));
    };

    React.useEffect(() => {
        setLoading(true);
        Promise.all([
            loadExpenses(),
            expensesApi
                .get("/groups", { params: { owner: auth.user } })
                .then((response) => setDestinations(response.data)),
        ])
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleMove = (expense, newGroupId) => {
        setLoading(true);
        expensesApi
            .patch(`/expenses/${expense._id}/group`, { groupId: newGroupId })
            .then(() => loadExpenses())
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
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
