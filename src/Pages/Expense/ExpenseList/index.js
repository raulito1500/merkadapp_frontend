import React from "react";
import { Badge, Form, ListGroup } from "react-bootstrap";
import moment from "moment";
import { formatMoney } from "../../../utils/formatting";
import { displayNameOf } from "../../../utils/userDisplay";

const PERSONAL_OPTION = "personal";

function ExpenseList({ expenses, destinations, onMove }) {
    if (expenses.length === 0) {
        return (
            <ListGroup className="mb-3">
                <ListGroup.Item>
                    <span className="text-muted">No expenses</span>
                </ListGroup.Item>
            </ListGroup>
        );
    }

    return (
        <ListGroup className="mb-3">
            {expenses.map((expense) => (
                <ListGroup.Item key={expense._id} className="d-flex justify-content-between align-items-start">
                    <div>
                        <strong className="d-block">{expense.description}</strong>
                        <span className="text-muted d-block">
                            {moment(expense.date).format("MMM Do, YYYY")}
                        </span>
                        <Badge bg="secondary" className="mt-1">
                            Pagó {displayNameOf(expense.paidBy)}
                        </Badge>
                    </div>
                    <div className="text-end">
                        <strong className="text-primary d-block">
                            {formatMoney(expense.amount)} {expense.currency}
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
    );
}

export { ExpenseList };
