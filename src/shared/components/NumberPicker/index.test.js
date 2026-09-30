import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { NumberPicker } from ".";

const decrease = () => screen.getByRole("button", { name: /decrease/i });
const increase = () => screen.getByRole("button", { name: /increase/i });
const field = () => screen.getByRole("textbox");

function Controlled({ initial = 1, ...props }) {
    const [value, setValue] = React.useState(initial);
    return (
        <>
            <NumberPicker value={value} onChange={setValue} {...props} />
            <output data-testid="parent-value">{value}</output>
            <button onClick={() => setValue(9)}>reset</button>
        </>
    );
}

describe("NumberPicker", () => {
    describe("rendering", () => {
        test("shows the default value", () => {
            render(<NumberPicker defaultValue={10} />);
            expect(field()).toHaveValue("10");
        });

        test("defaults to zero", () => {
            render(<NumberPicker />);
            expect(field()).toHaveValue("0");
        });

        test("does not add an 'undefined' class when className is omitted", () => {
            render(<NumberPicker />);
            expect(field().closest(".number-picker").className).not.toMatch(/undefined/);
        });

        test("applies a custom className", () => {
            render(<NumberPicker className="me-2" />);
            expect(field().closest(".number-picker")).toHaveClass("me-2");
        });

        test("forwards id and aria-label to the input", () => {
            render(<NumberPicker id="qty" aria-label="Quantity" />);
            expect(field()).toHaveAttribute("id", "qty");
            expect(screen.getByLabelText("Quantity")).toBe(field());
        });
    });

    describe("stepping", () => {
        test("increments with the button and reports a number", () => {
            const onChange = jest.fn();
            render(<NumberPicker defaultValue={10} onChange={onChange} />);
            fireEvent.click(increase());
            expect(field()).toHaveValue("11");
            expect(onChange).toHaveBeenCalledWith(11);
        });

        test("decrements with the button and reports a number", () => {
            const onChange = jest.fn();
            render(<NumberPicker defaultValue={10} onChange={onChange} />);
            fireEvent.click(decrease());
            expect(onChange).toHaveBeenCalledWith(9);
        });

        test("disables decrease at the minimum", () => {
            const onChange = jest.fn();
            render(<NumberPicker defaultValue={0} onChange={onChange} />);
            expect(decrease()).toBeDisabled();
            fireEvent.click(decrease());
            expect(onChange).not.toHaveBeenCalled();
        });

        test("disables increase at the maximum", () => {
            render(<NumberPicker defaultValue={10} max={10} />);
            expect(increase()).toBeDisabled();
        });

        test("respects a custom step and min", () => {
            const onChange = jest.fn();
            render(<NumberPicker defaultValue={1} min={1} step={0.5} onChange={onChange} />);
            fireEvent.click(increase());
            expect(onChange).toHaveBeenCalledWith(1.5);
            fireEvent.click(decrease());
            fireEvent.click(decrease());
            expect(decrease()).toBeDisabled();
            expect(field()).toHaveValue("1");
        });

        test("steps with the arrow keys", () => {
            const onChange = jest.fn();
            render(<NumberPicker defaultValue={5} onChange={onChange} />);
            fireEvent.keyDown(field(), { key: "ArrowUp" });
            expect(onChange).toHaveBeenLastCalledWith(6);
            fireEvent.keyDown(field(), { key: "ArrowDown" });
            expect(onChange).toHaveBeenLastCalledWith(5);
        });
    });

    describe("typing", () => {
        test("accepts decimals such as 1.05", () => {
            const onChange = jest.fn();
            render(<NumberPicker onChange={onChange} />);
            userEvent.clear(field());
            userEvent.type(field(), "1.05");
            expect(field()).toHaveValue("1.05");
            expect(onChange).toHaveBeenLastCalledWith(1.05);
        });

        test("accepts a comma as decimal separator and reports a dot-based number", () => {
            const onChange = jest.fn();
            render(<NumberPicker onChange={onChange} />);
            userEvent.clear(field());
            userEvent.type(field(), "1,5");
            expect(onChange).toHaveBeenLastCalledWith(1.5);
        });

        test("rejects non numeric characters", () => {
            render(<NumberPicker defaultValue={5} />);
            userEvent.type(field(), "abc");
            expect(field()).toHaveValue("5");
        });

        test("reports each new number only once", () => {
            const onChange = jest.fn();
            render(<NumberPicker onChange={onChange} />);
            userEvent.clear(field());
            userEvent.type(field(), "1.0");
            expect(onChange.mock.calls).toEqual([[1]]);
        });

        test("clamps the reported value to the maximum", () => {
            const onChange = jest.fn();
            render(<NumberPicker max={10} onChange={onChange} />);
            userEvent.clear(field());
            userEvent.type(field(), "15");
            expect(onChange).toHaveBeenLastCalledWith(10);
        });
    });

    describe("blur", () => {
        test("normalizes an empty field to zero instead of NaN", () => {
            const onBlur = jest.fn();
            render(<NumberPicker defaultValue={5} onBlur={onBlur} />);
            userEvent.clear(field());
            fireEvent.blur(field());
            expect(field()).toHaveValue("0");
            expect(onBlur).toHaveBeenCalledWith(0);
        });

        test("normalizes a trailing decimal separator", () => {
            const onBlur = jest.fn();
            render(<NumberPicker onBlur={onBlur} />);
            userEvent.clear(field());
            userEvent.type(field(), "1.");
            fireEvent.blur(field());
            expect(field()).toHaveValue("1");
            expect(onBlur).toHaveBeenCalledWith(1);
        });

        test("clamps the displayed value to the maximum", () => {
            const onBlur = jest.fn();
            render(<NumberPicker max={10} onBlur={onBlur} />);
            userEvent.clear(field());
            userEvent.type(field(), "15");
            fireEvent.blur(field());
            expect(field()).toHaveValue("10");
            expect(onBlur).toHaveBeenCalledWith(10);
        });

        test("reports the typed number", () => {
            const onBlur = jest.fn();
            render(<NumberPicker defaultValue={10} onBlur={onBlur} />);
            userEvent.clear(field());
            userEvent.type(field(), "15");
            fireEvent.blur(field());
            expect(onBlur).toHaveBeenCalledWith(15);
        });
    });

    describe("controlled", () => {
        test("shows the value and reports changes", () => {
            render(<Controlled initial={3} />);
            expect(field()).toHaveValue("3");
            fireEvent.click(increase());
            expect(field()).toHaveValue("4");
            expect(screen.getByTestId("parent-value")).toHaveTextContent("4");
        });

        test("keeps an in-progress decimal while the parent echoes the number back", () => {
            render(<Controlled initial={0} />);
            userEvent.clear(field());
            userEvent.type(field(), "1.");
            expect(field()).toHaveValue("1.");
            expect(screen.getByTestId("parent-value")).toHaveTextContent("1");
        });

        test("follows the parent when the value changes from outside", () => {
            render(<Controlled initial={3} />);
            fireEvent.click(screen.getByText("reset"));
            expect(field()).toHaveValue("9");
        });

        test("steps from the value the parent set, not from stale text", () => {
            render(<Controlled initial={3} />);
            fireEvent.click(screen.getByText("reset"));
            fireEvent.click(increase());
            expect(field()).toHaveValue("10");
        });

        test("snaps back when the parent ignores a change", () => {
            render(<NumberPicker value={3} onChange={() => {}} />);
            fireEvent.click(increase());
            expect(field()).toHaveValue("3");
        });

        test("accepts numeric strings as value", () => {
            render(<NumberPicker value="7" onChange={() => {}} />);
            expect(field()).toHaveValue("7");
        });
    });

    describe("states", () => {
        test("marks the field and wrapper as invalid", () => {
            render(<NumberPicker isInvalid />);
            expect(field()).toHaveClass("text-danger");
            expect(field()).toHaveAttribute("aria-invalid", "true");
            expect(field().closest(".number-picker")).toHaveClass("is-invalid");
        });

        test("is not marked invalid by default", () => {
            render(<NumberPicker />);
            expect(field()).not.toHaveAttribute("aria-invalid");
            expect(field().closest(".number-picker")).not.toHaveClass("is-invalid");
        });

        test("disables the input and both buttons", () => {
            render(<NumberPicker defaultValue={5} disabled />);
            expect(field()).toBeDisabled();
            expect(decrease()).toBeDisabled();
            expect(increase()).toBeDisabled();
        });
    });
});
