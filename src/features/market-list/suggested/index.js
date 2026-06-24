import React from "react";
import { ListGroup } from "react-bootstrap";
import MarketListSuggestedItem from "../SuggestedItem";

const MarketListSuggested = ({ suggestedItems = [] }) => {
    if (suggestedItems.length === 0) {
        return <></>;
    }
    const items = suggestedItems.slice(0, 5);
    return (
        <>
            <div className="p-2 mb-0 mt-3 text-secondary">
                <h5>
                    <i className="bi bi-stars"></i> Recommendations
                </h5>
            </div>
            <p>These are our recommendations for the next market list, based on your shopping experience</p>
            <ListGroup>
                {items.map((suggestedItem, index) => (
                    <ListGroup.Item className="ps-2" key={index + suggestedItem.product_id} as="div">
                        <MarketListSuggestedItem suggestedItem={suggestedItem} />
                    </ListGroup.Item>
                ))}
                {suggestedItems.length > 5 && (
                    <ListGroup.Item>
                        Show {suggestedItems.length - items.length} other suggested items
                    </ListGroup.Item>
                )}
            </ListGroup>
        </>
    );
};

export default MarketListSuggested;
