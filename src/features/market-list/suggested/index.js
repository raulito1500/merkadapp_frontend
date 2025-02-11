import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const MarketListSuggested = ({ suggestedItems = [] }) => {
    if (suggestedItems.length === 0) {
        return <></>;
    }
    return (
        <Card>
            <Card.Title className="p-2 mb-0 text-secondary">
                <i className="bi bi-stars"></i> Recommendations
            </Card.Title>
            <Card.Body className="d-flex flex-row flex-wrap">
                <p>
                    These are our recommendations for the next market list, based on your shopping experience
                </p>
                <ListGroup>
                    {suggestedItems.map((suggestedItem, index) => (
                        <ListGroup.Item
                            key={index + suggestedItem.product_id}
                            as="div"
                            className="list-group-item d-flex align-items-center"
                        >
                            <span className="pt-1 form-checked-content flex-grow-1 pe-2">
                                {suggestedItem.product_name}
                            </span>
                            <input className="form-check-input fs-4" type="checkbox" />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card.Body>
        </Card>
    );
};

export default MarketListSuggested;
