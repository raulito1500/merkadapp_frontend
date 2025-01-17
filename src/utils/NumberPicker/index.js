import React, { useState, useCallback } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import "./index.scss"

function NumberPicker({ className, initialValue = 0, onChange = () => {}, onBlur = () => {}, isInvalid }) {
    const STEP = 1;
    const MIN_VALUE = 0;

    const [value, setValue] = useState(initialValue.toString());

    const stepUp = useCallback(() => {
        let numericValue = parseFloat(value) || 0;
        numericValue += STEP;
        setValue(numericValue.toString());
        let fakeevent = { target: { value: numericValue } };
        onChange(fakeevent);
    }, [value, onChange]);

    const stepDown = useCallback(() => {
        let numericValue = parseFloat(value) || 0;
        numericValue = numericValue > MIN_VALUE ? numericValue - STEP : 0;
        setValue(numericValue.toString());
        let fakeevent = { target: { value: numericValue } };
        onChange(fakeevent);
    }, [value, onChange]);

    const handleChange = (event) => {
        const inputValue = event.target.value;
        setValue(inputValue);
        onChange(event);
    }

    const handleBlur = () => {
        let numericValue = parseFloat(value);
        setValue(numericValue.toString());
        onBlur(numericValue);
    }
    return (
        <InputGroup className={className + " number-picker border rounded px-1 py-0 text-nowrap" + (isInvalid ? " border-danger" : "")}>
            <Button
                variant="link"
                aria-label="Decrease"
                className="p-0 m-0"
                onClick={() => stepDown()} >
                <i className="bi bi-dash-circle"></i>
            </Button>
            <Form.Control
                value={value}
                onChange={(event) => handleChange(event)}
                onBlur={handleBlur}
                className={"bg-transparent border-0 text-center " + (isInvalid ? "text-danger" : "")}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                placeholder="0.00"
            />
            <Button
                variant="link"
                aria-label="Increase"
                className="p-0 m-0"
                onClick={() => stepUp()} >
                <i className="bi bi-plus-circle"></i>
            </Button>
        </InputGroup>
    )
}
export { NumberPicker }