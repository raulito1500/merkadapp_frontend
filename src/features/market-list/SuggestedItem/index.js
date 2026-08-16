import React from "react";
import moment from "moment";
import NumberPicker from "../../../components/NumberPicker";
import { formatMoney } from "../../../utils/formatting";

const MarketListSuggestedItem = ({ suggestedItem }) => {
    return (
        <div className="d-flex align-items-center gap-3 position-relative py-1">
            <input className="form-check-input fs-4" type="checkbox" />
            <div className="d-flex flex-column flex-grow-1">
                <span className="flex-grow-1">{suggestedItem.product_name}</span>
                <small>
                    {suggestedItem.date ? moment(suggestedItem.date).fromNow() : "No purchase history yet"}
                </small>
                {suggestedItem.value != null && (
                    <strong className="text-primary mt-2"> {formatMoney(suggestedItem.value)}</strong>
                )}
            </div>
            <NumberPicker initialValue={suggestedItem.quantity} />
        </div>
    );
};

export default MarketListSuggestedItem;
