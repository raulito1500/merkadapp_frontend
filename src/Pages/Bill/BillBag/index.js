import React from "react";
import { Accordion, Form } from "react-bootstrap";

function BillBag({bag, index, onInputChange, onBlur}) {
    return (
        <Accordion.Item>
            <Accordion.Header>
                <Form.Group className="col-sm-2">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control
                        value={bag.quantity}
                        onChange={(event) => onInputChange("bags", index, "quantity", event.target.value)}
                        onBlur={() => onBlur("bags", index, "quantity")}
                    />
                </Form.Group>
                <Form.Group className="col-sm-2">
                    <Form.Label>Unit value</Form.Label>
                    <Form.Control
                        value={bag.value}
                        onChange={(event) => onInputChange("bags", index, "value", event.target.value)}
                        onBlur={() => onBlur("bags", index, "value")}
                    />
                </Form.Group>
                <Form.Group className="col-sm-2">
                    <Form.Label>Total</Form.Label>
                    <Form.Control
                        value={bag.total}
                        disabled
                        readOnly
                    />
                </Form.Group>
            </Accordion.Header>
        </Accordion.Item>)
}
export { BillBag }