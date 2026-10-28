import React from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import PageTitle from "../../../shared/components/PageTitle";
import { displayNameOf } from "../../../shared/utils/userDisplay";
import { useExpenseForm } from "../hooks/useExpenseForm";

function ExpenseCreate() {
    const { groupId } = useParams();
    const {
        group,
        description,
        setDescription,
        amount,
        setAmount,
        currency,
        setCurrency,
        date,
        setDate,
        paidBy,
        setPaidBy,
        handleSubmit,
    } = useExpenseForm(groupId);

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
