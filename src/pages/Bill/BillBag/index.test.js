import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "react-bootstrap";
import "@testing-library/jest-dom";
import { BillBag } from ".";

function Parent({ initial, spy, errors = {} }) {
    const [bag, setBag] = React.useState(initial);
    const handleChange = (updated) => {
        spy(updated);
        setBag({ ...updated });
    };
    return (
        <Accordion>
            <BillBag bag={bag} index={0} errors={errors} onChange={handleChange} onBlur={spy} />
        </Accordion>
    );
}

function renderBag(bag, errors) {
    const spy = jest.fn();
    render(<Parent initial={bag} spy={spy} errors={errors} />);
    return { spy, quantity: screen.getAllByRole("textbox")[0] };
}

describe("BillBag quantity", () => {
    test("shows the bag quantity", () => {
        const { quantity } = renderBag({ quantity: 4, value: 100, total: 400 });
        expect(quantity).toHaveValue("4");
    });

    test("recalculates the total when the quantity is stepped", () => {
        const { spy, quantity } = renderBag({ quantity: 4, value: 100, total: 400 });
        fireEvent.click(screen.getByRole("button", { name: /increase/i }));
        expect(quantity).toHaveValue("5");
        expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ quantity: 5, total: 500 }));
    });

    test("recalculates the total when the quantity is typed", () => {
        const { spy, quantity } = renderBag({ quantity: 1, value: 100, total: 100 });
        userEvent.clear(quantity);
        userEvent.type(quantity, "2.5");
        expect(quantity).toHaveValue("2.5");
        expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ quantity: 2.5, total: 250 }));
    });

    test("flags the quantity when the parent reports an error", () => {
        const { quantity } = renderBag({ quantity: 0, value: 0, total: 0 }, { "bags[0].quantity": "Required" });
        expect(quantity.closest(".number-picker")).toHaveClass("is-invalid");
    });
});
