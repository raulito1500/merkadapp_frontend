import React from "react";
import { Accordion, Form, Row } from "react-bootstrap";
import { useUtilities } from "../../../App/Context/utilities";
import { NumberPicker } from "../../../Utils/NumberPicker";

function BillBag({ bag, index, errors, onChange, onBlur }) {
    const utilities = useUtilities();

    const handleChange = (field, event) => {
        const inputValue = event.target.value;
        if (["quantity", "value"].includes(field)) {
            const regex = /^\d*\.?\d*$/;
            if (regex.test(inputValue)) {
                bag[field] = inputValue;
            }
            calculateTotalBag();
        } else {
            bag[field] = inputValue;
        }
        onChange(bag);
    }

    const handleBlur = (field) => {
        if (["quantity", "value"].includes(field)) {
            let parsedValue = parseFloat(bag[field]);
            if (isNaN(parsedValue) || parsedValue < 0)
                parsedValue = 0;
            bag[field] = parsedValue;
            calculateTotalBag();
        }
        onBlur(bag)
    }

    const calculateTotalBag = () => {
        let total = 0;
        if (!(isNaN(bag.quantity) || isNaN(bag.value)))
            total = bag.quantity * bag.value;
        bag.total = total;
    }

    return (
        <Accordion.Item>
            <Row xs={12} className="p-3">
                <Form.Group className="col-4 col-sm-2">
                    <Form.Label>Quantity</Form.Label>
                    <NumberPicker
                        initialValue={bag.quantity}
                        onChange={(event) => handleChange("quantity", event)}
                        onBlur={() => handleBlur("quantity")}
                        isInvalid={!!errors[`bags[${index}].quantity`]}
                    />
                </Form.Group>
                <Form.Group className="col-4 col-sm-2">
                    <Form.Label>Unit value</Form.Label>
                    <Form.Control
                        value={bag.value}
                        onChange={(event) => handleChange("value", event)}
                        onBlur={() => handleBlur("value")}
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