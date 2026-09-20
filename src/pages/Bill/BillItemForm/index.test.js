import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "react-bootstrap";
import "@testing-library/jest-dom";
import BillItemForm from ".";

const buildItem = (overrides = {}) => ({
    product_id: "",
    quantity: 2,
    description: "Olive oil",
    brand: "Euro",
    content: 500,
    unit: "ML",
    is_additional: false,
    unit_value: 10,
    discount: 0,
    total: 20,
    ...overrides,
});

function Parent({ initial, spy, errors = {} }) {
    const [item, setItem] = React.useState(initial);
    const handleChange = (updated) => {
        spy(updated);
        setItem({ ...updated });
    };
    return (
        <Accordion>
            <BillItemForm
                item={item}
                index={0}
                products={[]}
                errors={errors}
                onChange={handleChange}
                onBlur={spy}
                onRemove={() => {}}
            />
        </Accordion>
    );
}

function renderForm(item, errors) {
    const spy = jest.fn();
    render(<Parent initial={item} spy={spy} errors={errors} />);
    return { spy, quantity: screen.getAllByRole("textbox")[1] };
}

describe("BillItemForm quantity", () => {
    test("shows the item quantity", () => {
        const { quantity } = renderForm(buildItem({ quantity: 3 }));
        expect(quantity).toHaveValue("3");
    });

    test("recalculates the total when the quantity is stepped", () => {
        const { spy, quantity } = renderForm(buildItem());
        fireEvent.click(screen.getByRole("button", { name: /increase/i }));
        expect(quantity).toHaveValue("3");
        expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ quantity: 3, total: 30 }));
    });

    test("recalculates the total when the quantity is typed", () => {
        const { spy, quantity } = renderForm(buildItem({ quantity: 0, total: 0 }));
        userEvent.clear(quantity);
        userEvent.type(quantity, "2.5");
        expect(quantity).toHaveValue("2.5");
        expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ quantity: 2.5, total: 25 }));
    });

    test("applies the discount to the recalculated total", () => {
        const { spy } = renderForm(buildItem({ discount: 0.5 }));
        fireEvent.click(screen.getByRole("button", { name: /increase/i }));
        expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ quantity: 3, total: 15 }));
    });

    test("notifies blur so the parent can validate", () => {
        const { spy, quantity } = renderForm(buildItem());
        fireEvent.blur(quantity);
        expect(spy).toHaveBeenLastCalledWith(expect.objectContaining({ quantity: 2 }));
    });

    test("flags the quantity when the parent reports an error", () => {
        const { quantity } = renderForm(buildItem(), { "items[0].quantity": "Quantity must be greater than 0" });
        expect(quantity.closest(".number-picker")).toHaveClass("is-invalid");
        expect(screen.getByText("Quantity must be greater than 0")).toBeInTheDocument();
    });
});
