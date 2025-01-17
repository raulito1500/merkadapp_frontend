import React, { useEffect } from "react";
import { Card } from "react-bootstrap";
import moment from "moment";
import { formatMoney, formatPercent } from "../../../utils/formatting";

const calculateVariation = ({ total: currentTotal }, { total: previousTotal = 0 }) => {
    if (currentTotal === 0 && previousTotal === 0) return 0;
    if (previousTotal === 0) return 100;
    if (currentTotal === 0) return -100;
    return ((currentTotal - previousTotal) / previousTotal) * 100;
};

function BudgetWidget({ data }) {
    const [currentBudget, setCurrentBudget] = React.useState();

    useEffect(() => {
        let last = data.length - 1;
        if (last >= 0) {
            data[last].variation = calculateVariation(data[last], last > 0 ? data[last - 1] : { total: 0 });
            setCurrentBudget(data[last]);
        }
    }, [data]);

    if (!currentBudget) {
        return (
            <Card className="shadow-sm h-100">
                <Card.Body>
                    <h6 className="fw-normal text-muted mt-0 mb-3">Budget</h6>
                    <h6 className="fw-normal text-muted mt-0 mb-3">No data available</h6>
                </Card.Body>
            </Card>
        );
    }
    const variationClass = currentBudget.variation <= 0 ? "text-success" : "text-danger";
    const variationIcon = currentBudget.variation <= 0 ? "bi-arrow-down-right" : "bi-arrow-up-right";
    const formattedMonth = moment(currentBudget.date).format("MMMM");

    return (
        <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
                <h6 className="fw-normal text-muted mt-0 mb-3">Budget</h6>
                <div className="d-flex">
                    <div className="feature-icon card-highlight">
                        <i className="bi bi-graph-up-arrow"></i>
                    </div>
                    <div className="ps-2">
                        <h3 className="mt-1 mb-0">{formatMoney(currentBudget.total)}</h3>
                        <p className="text-muted mb-0">
                            <span className={`mb-2 d-block fw-bold ${variationClass}`}>
                                <i className={`bi ${variationIcon}`}></i>
                                {formatPercent(currentBudget.variation)}
                            </span>
                        </p>
                    </div>
                </div>
                <span className="text-muted text-nowrap">{formattedMonth}</span>
            </Card.Body>
        </Card>
    );
}

export { BudgetWidget };
