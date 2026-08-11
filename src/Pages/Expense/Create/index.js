import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { AppContext } from "../../../App/Context/app";
import { useAuth } from "../../../App/Context/auth";
import { expensesApi } from "../../../App/Context/expensesApi";
import PageTitle from "../../../components/PageTitle";
import { displayNameOf } from "../../../utils/userDisplay";

function ExpenseCreate() {
    const { groupId } = useParams();
    const auth = useAuth();
    const navigate = useNavigate();
    const { setLoading, pushNotifications } = React.useContext(AppContext);
    const [group, setGroup] = React.useState(null);
    const [description, setDescription] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [currency, setCurrency] = React.useState("COP");
    const [date, setDate] = React.useState(moment().format("YYYY-MM-DD"));
    const [paidBy, setPaidBy] = React.useState(auth.user.uid);

    React.useEffect(() => {
        if (!groupId) return;
        setLoading(true);
        expensesApi
            .get(`/groups/${groupId}`)
            .then((response) => {
                setGroup(response.data);
                setPaidBy(
                    response.data.members.some((member) => member.uid === auth.user.uid)
                        ? auth.user.uid
                        : response.data.members[0].uid
                );
            })
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    }, [groupId]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        expensesApi
            .post("/expenses", {
                description,
                amount: Number(amount),
                currency,
                date,
                paidBy,
                groupId: groupId ?? undefined,
            })
            .then(() => navigate(groupId ? `/expenses/${groupId}` : "/expenses/personal"))
            .catch((error) => {
                pushNotifications("¡Ups! Something went wrong", error, "warning");
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            <PageTitle>Add expense</PageTitle>
            <Card>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                value={amount}
                                onChange={(event) => setAmount(event.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Currency</Form.Label>
                            <Form.Control
                                value={currency}
                                onChange={(event) => setCurrency(event.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={date}
                                onChange={(event) => setDate(event.target.value)}
                                required
                            />
                        </Form.Group>
                        {group && (
                            <Form.Group className="mb-3">
                                <Form.Label>Who paid?</Form.Label>
                                <Form.Select
                                    value={paidBy}
                                    onChange={(event) => setPaidBy(event.target.value)}
                                    required
                                >
                                    {group.members.map((member) => (
                                        <option key={member.uid} value={member.uid}>
                                            {displayNameOf(member)}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        )}
                        <Button type="submit" variant="primary" className="text-white">
                            Save expense
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    );
}

export { ExpenseCreate };
