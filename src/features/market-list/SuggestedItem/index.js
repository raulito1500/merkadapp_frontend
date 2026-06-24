import React from "react";
import NumberPicker from "../../../components/NumberPicker";

const MarketListSuggestedItem = ({ suggestedItem }) => {
    return (
        <div className="d-flex align-items-center gap-3 position-relative py-1">
            <input className="form-check-input fs-4" type="checkbox" />
            <div className="d-flex flex-column flex-grow-1">
                <span className="flex-grow-1">{suggestedItem.product_name}</span>
                <small>
                    5 days ago
                </small>
                <strong className="text-primary mt-2"> $41.990</strong>
            </div>
            <NumberPicker initialValue={suggestedItem.quantity} />
        </div>
    );
};

export default MarketListSuggestedItem;
