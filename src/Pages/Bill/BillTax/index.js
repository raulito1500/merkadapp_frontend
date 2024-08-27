import React from "react";
import { Accordion, Form } from "react-bootstrap";

function BillTax({tax, index, onInputChange, onBlur}) {
    return (
        <Accordion.Item>
            <Accordion.Header>
                <Form.Group className="col-sm-2">
                    <Form.Label>Concept</Form.Label>
                    <Form.Control
                        value={tax.concept}
                        onChange={(event) => onInputChange("taxes", index, "concept", event.target.value)}
                    />
                </Form.Group>
                <Form.Group className="col-sm-2">
                    <Form.Label>Total</Form.Label>
                    <Form.Control
                        value={tax.total}
                        onChange={(event) => onInputChange("taxes", index, "total", event.target.value)}
                        onBlur={() => onBlur("taxes", index, "total")}
                    />
                </Form.Group>
            </Accordion.Header>
        </Accordion.Item>)
}
export { BillTax }