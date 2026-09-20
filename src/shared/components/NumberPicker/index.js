import React, { useReducer } from "react";
import PropTypes from "prop-types";
import { Button, Form, InputGroup } from "react-bootstrap";
import { createState, reducer, toValue } from "./reducer";
import "./index.scss";

function NumberPicker({
    value,
    defaultValue = 0,
    onChange = () => {},
    onBlur = () => {},
    min = 0,
    max = Infinity,
    step = 1,
    isInvalid = false,
    disabled = false,
    className = "",
    id,
    "aria-label": ariaLabel,
}) {
    const isControlled = value !== undefined;
    const bounds = { min, max };

    const [state, dispatch] = useReducer(reducer, undefined, () =>
        createState(isControlled ? value : defaultValue, bounds)
    );

    // Dispatching while rendering re-renders immediately, so the text never shows a stale value.
    if (isControlled) {
        const sync = { type: "sync", value, ...bounds };
        if (reducer(state, sync) !== state) dispatch(sync);
    }

    const current = toValue(state.text, bounds);

    const apply = (action) => {
        const next = reducer(state, action);
        if (next === state) return;
        dispatch(action);
        const nextValue = toValue(next.text, bounds);
        if (nextValue !== current) onChange(nextValue);
    };

    const stepBy = (direction) => apply({ type: "step", direction, step, ...bounds });

    const handleBlur = () => {
        const commit = { type: "commit", ...bounds };
        const committed = reducer(state, commit);
        if (committed !== state) dispatch(commit);
        onBlur(toValue(committed.text, bounds));
    };

    const handleKeyDown = (event) => {
        if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
        event.preventDefault();
        stepBy(event.key === "ArrowUp" ? 1 : -1);
    };

    const rootClassName = ["z-1 number-picker text-nowrap", isInvalid && "is-invalid", className]
        .filter(Boolean)
        .join(" ");
    const buttonClassName = `p-0 m-0 border rounded-circle ${isInvalid ? "border-danger text-danger" : ""}`;

    return (
        <InputGroup className={rootClassName}>
            <Button
                variant="link"
                aria-label="Decrease"
                className={`${buttonClassName} me-2`}
                disabled={disabled || current <= min}
                onClick={() => stepBy(-1)}
            >
                <i className="bi bi-dash-lg p-2"></i>
            </Button>
            <Form.Control
                id={id}
                aria-label={ariaLabel}
                aria-invalid={isInvalid || undefined}
                value={state.text}
                onChange={(event) => apply({ type: "type", text: event.target.value, ...bounds })}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                className={`bg-transparent border-0 px-0 text-center ${isInvalid ? "text-danger" : ""}`}
                type="text"
                inputMode="decimal"
                pattern="[0-9]*[.,]?[0-9]*"
                placeholder="0.00"
            />
            <Button
                variant="link"
                aria-label="Increase"
                className={`${buttonClassName} ms-2`}
                disabled={disabled || current >= max}
                onClick={() => stepBy(1)}
            >
                <i className="bi bi-plus-lg p-2"></i>
            </Button>
        </InputGroup>
    );
}

NumberPicker.propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    isInvalid: PropTypes.bool,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string,
    "aria-label": PropTypes.string,
};

export { NumberPicker };
