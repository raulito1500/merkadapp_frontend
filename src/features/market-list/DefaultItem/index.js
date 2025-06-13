import React from "react";
import NumberPicker from "../../../components/NumberPicker";

function MarketListDefaultItem({ item }) {
    return (
        <div className="d-flex align-items-center gap-3 position-relative py-1">
            <div className="d-flex flex-column flex-grow-1">
                <span>{item.product_name}</span>
            </div>
            <NumberPicker initialValue={item.quantity} />
        </div>
    );
}

export default MarketListDefaultItem;
