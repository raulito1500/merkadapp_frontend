import React from "react";
import { Accordion, Form, Row } from "react-bootstrap";
import { useUtilities } from "../../../App/Context/utilities";

function BillBag({ bag, index, onInputChange, onBlur }) {
    const utilities = useUtilities();
    return (
        <Accordion.Item>
            <Row xs={12} className="p-3">
                <Form.Group className="col-4 col-sm-2">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        value={bag.quantity}
                        onChange={(event) => onInputChange("bags", index, "quantity", event.target.value)}
                        onBlur={() => onBlur("bags", index, "quantity")}
                    />
                </Form.Group>
                <Form.Group className="col-4 col-sm-2">
                    <Form.Label>Unit value</Form.Label>
                    <Form.Control
                        value={bag.value}
                        onChange={(event) => onInputChange("bags", index, "value", event.target.value)}
                        onBlur={() => onBlur("bags", index, "value")}
                    />
                </Form.Group>
                <div className="col-4 col-sm-3 pt-2 p-sm-0">
                    <label>Total</label>
                    <h3 className="mb-0 text-primary position-relative">${utilities.formatMoney(bag.total)}
                    </h3>
                </div>
            </Row>
        </Accordion.Item>)
}
export { BillBag }