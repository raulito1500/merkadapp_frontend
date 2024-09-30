import React from "react";
import { Accordion, Form, Row } from "react-bootstrap";

function BillTax({ tax, index, onInputChange, onBlur }) {
    return (
        <Accordion.Item>
            <Row xs={12} className="p-3">
                <Form.Group className="col-8 col-sm-3">
                    <Form.Label>Concept</Form.Label>
                    <Form.Control
                        value={tax.concept}
                        onChange={(event) => onInputChange("taxes", index, "concept", event.target.value)}
                    />
                </Form.Group>
                <Form.Group className="col-4 col-sm-2">
                    <Form.Label>Total</Form.Label>
                    <Form.Control
                        value={tax.total}
                        onChange={(event) => onInputChange("taxes", index, "total", event.target.value)}
                        onBlur={() => onBlur("taxes", index, "total")}
                    />
                </Form.Group>
            </Row>
        </Accordion.Item>)
}
export { BillTax }