import React from "react";
import { Accordion, Form, Row } from "react-bootstrap";

function BillTax({ tax, index, onChange, onBlur }) {
    const handleChange = (field, event) => {
        const inputValue = event.target.value;
        if (["total"].includes(field)) {
            const regex = /^\d*\.?\d*$/;
            if (regex.test(inputValue)) {
                tax[field] = inputValue;
            }
            tax.total = tax.total * 1;
        } else {
            tax[field] = inputValue;
        }
        onChange(tax);
    }

    const handleBlur = (field) => {
        if (["total"].includes(field)) {
            let parsedValue = parseFloat(tax[field]);
            if (isNaN(parsedValue) || parsedValue < 0)
                parsedValue = 0;
            tax[field] = parsedValue;
        }
        onBlur(tax)
    }

    return (
        <Accordion.Item>
            <Row xs={12} className="p-3">
                <Form.Group className="col-8 col-sm-3">
                    <Form.Label>Concept</Form.Label>
                    <Form.Control
                        value={tax.concept}
                        onChange={(event) => handleChange("concept", event)}
                        onBlur={() => handleBlur("concept")}
                    />
                </Form.Group>
                <Form.Group className="col-4 col-sm-2">
                    <Form.Label>Total</Form.Label>
                    <Form.Control
                        value={tax.total}
                        onChange={(event) => handleChange("total", event)}
                        onBlur={() => handleBlur("total")}
                    />
                </Form.Group>
            </Row>
        </Accordion.Item>)
}
export { BillTax }