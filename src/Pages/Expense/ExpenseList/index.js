import React from "react";
import { Badge, Col, Form, ListGroup } from "react-bootstrap";
import moment from "moment";
import { useAuth } from "../../../App/Context/auth";
import { formatMoney } from "../../../utils/formatting";
import { displayNameOf } from "../../../utils/userDisplay";

const PERSONAL_OPTION = "personal";

function groupByMonth(expenses) {
    return expenses.reduce((grouped, expense) => {
        const month = moment(expense.date).format("MMMM YYYY");
        if (!grouped[month]) {
            grouped[month] = [];
        }
        grouped[month].push(expense);
        return grouped;
    }, {});
}

function paidByLabel(paidBy, currentUid) {
    return paidBy?.uid === currentUid ? "You paid" : `Paid by ${displayNameOf(paidBy)}`;
}

function ExpenseList({ expenses, destinations, onMove }) {
    const { user } = useAuth();

    if (expenses.length === 0) {
        return (
            <ListGroup className="mb-3">
                <ListGroup.Item>
                    <span className="text-muted">No expenses</span>
                </ListGroup.Item>
            </ListGroup>
        );
    }

    const grouped = groupByMonth(expenses);

    return (
        <>
            {Object.keys(grouped).map((month) => (
                <Col key={month} className="position-relative">
                    <Badge className="list-group-title ms-3" bg="success">
                        {month}
                    </Badge>
                    <ListGroup className="mb-3">
                        {grouped[month].map((expense) => (
                            <ListGroup.Item
                                key={expense._id}
                                className="d-flex justify-content-between align-items-center gap-3"
                            >
                                <div
                                    className="progress-circle rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                                    style={{ "--progress": 0 }}
                                >
                                    <div className="progress-content rounded-circle d-inline-flex align-items-center justify-content-center bg-white">
                                        <i className="bi bi-receipt fs-3 p-0"></i>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <strong className="d-block">{expense.description}</strong>
                                    <span className="text-muted d-block">
                                        {moment(expense.date).format("MMM Do, YYYY")}
                                    </span>
                                </div>
                                <div className="text-end">
                                    <span className="text-muted small d-block">
                                        {paidByLabel(expense.paidBy, user.uid)}
                                    </span>
                                    <strong className="d-block">
                                        {formatMoney(expense.amount)}{" "}
                                        <span className="text-muted small fw-normal">{expense.currency}</span>
                                    </strong>
                                    {destinations && onMove && (
                                        <Form.Select
                                            size="sm"
                                            className="mt-2"
                                            value={expense.groupId ?? PERSONAL_OPTION}
                                            onChange={(event) => {
                                                const value = event.target.value;
                                                onMove(expense, value === PERSONAL_OPTION ? null : value);
                                            }}
                                        >
                                            <option value={PERSONAL_OPTION}>Personal</option>
                                            {destinations.map((group) => (
                                                <option key={group._id} value={group._id}>
                                                    {group.name}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    )}
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            ))}
        </>
    );
}

export { ExpenseList };
