import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageTitle from "../../../shared/components/PageTitle";
import { ExpenseList } from "./ExpenseList";
import { usePersonalExpenses } from "../hooks/usePersonalExpenses";

function PersonalView() {
    const { expenses, destinations, handleMove } = usePersonalExpenses();

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
