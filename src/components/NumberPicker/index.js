import React, { useReducer } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import "./index.scss";

function NumberPicker({
    className = "",
    initialValue = 0,
    onChange = () => {},
    onBlur = () => {},
    isInvalid,
}) {
    const STEP = 1;
    const MIN_VALUE = 0;

    function reducer(state, action) {
        switch (action.type) {
            case "increase":
                return state + STEP;
            case "decrease":
                return state > MIN_VALUE ? state - STEP : state;
            case "set":
                console.log(action.newValue);
                let newValue = action.newValue;
                if (newValue.endsWith(".") || newValue.endsWith(",")) {
                    // newValue += "0";
                    return newValue;
                }
                let parsedValue = parseFloat(newValue) || 0;
                return parsedValue;
            default:
                return state;
        }
    }

    const [value, dispatch] = useReducer(reducer, initialValue);

    const handleChange = (event) => {
        console.log(event.target.value);
    };

    const handleBlur = (event) => {
        console.log(event.target.value);
    };
    return (
        <InputGroup className={`z-1 number-picker text-nowrap ${className}`}>
            <Button
                variant="link"
                aria-label="Decrease"
                className="p-0 m-0 me-2 border rounded-circle"
                onClick={() => {
                    dispatch({ type: "decrease" });
                }}
            >
                <i className="bi bi-dash-lg p-2"></i>
            </Button>
            <Form.Control
                value={value}
                onChange={(event) => {
                    dispatch({ type: "set", newValue: event.target.value });
                }}
                onBlur={(event) => {
                    dispatch({ type: "set", newValue: event.target.value });
                }}
                className={`bg-transparent border-0 px-0 text-center  ${isInvalid ? "text-danger" : ""}`}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                placeholder="0.00"
            />
            <Button
                variant="link"
                aria-label="Increase"
                className="p-0 m-0 ms-2 border rounded-circle"
                onClick={() => {
                    dispatch({ type: "increase" });
                }}
            >
                <i className="bi bi-plus-lg p-2"></i>
            </Button>
        </InputGroup>
    );
}

export default NumberPicker;
