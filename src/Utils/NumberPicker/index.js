import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

function NumberPicker({ value, onChange, isInvalid }) {
    const STEP = 1;
    const MIN_VALUE = 0;

    const stepUp = () => {
        value += STEP;
        onChange(value);
    }
    const stepDown = () => {
        value = value > MIN_VALUE ? value - STEP : value;
        onChange(value);
    }

    const handleChange = (value) => {
        value = parseFloat(value);
        if (isNaN(value)) value = "";
        onChange(value);
    }
    return (
        <InputGroup className={"number-picker border rounded px-1 py-0 text-nowrap" + (isInvalid ? " border-danger" : "")}>
            <Button
                variant="link"
                className="p-0 m-0"
                onClick={() => stepDown()} >
                <i className="bi bi-dash-circle"></i>
            </Button>
            <Form.Control
                value={value}
                onChange={(event) => handleChange(event.target.value)}
                className={"bg-transparent border-0 text-center " + (isInvalid ? "text-danger" : "")}
                type="number" />
            <Button
                variant="link"
                className="p-0 m-0"
                onClick={() => stepUp()} >
                <i className="bi bi-plus-circle"></i>
            </Button>
        </InputGroup>
    )
}
export { NumberPicker }