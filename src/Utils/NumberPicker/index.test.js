import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NumberPicker } from ".";w
import '@testing-library/jest-dom/extend-expect';

describe("NumberPicker Component", () => {
  test("renders correctly with initial value", () => {
    render(<NumberPicker value={10} onChange={() => {}} isInvalid={false} />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("10");
  });

  test("increments value when increment button is clicked", () => {
    const mockOnChange = jest.fn();
    render(<NumberPicker value={10} onChange={mockOnChange} isInvalid={false} />);
    const incrementButton = screen.getByRole("button", { name: /increment/i });
    fireEvent.click(incrementButton);
    expect(mockOnChange).toHaveBeenCalledWith(11);
  });

  test("decrements value when decrement button is clicked", () => {
    const mockOnChange = jest.fn();
    render(<NumberPicker value={10} onChange={mockOnChange} isInvalid={false} />);
    const decrementButton = screen.getByRole("button", { name: /decrement/i });
    fireEvent.click(decrementButton);
    expect(mockOnChange).toHaveBeenCalledWith(9);
  });

  test("does not decrement below zero", () => {
    const mockOnChange = jest.fn();
    render(<NumberPicker value={0} onChange={mockOnChange} isInvalid={false} />);
    const decrementButton = screen.getByRole("button", { name: /decrement/i });
    fireEvent.click(decrementButton);
    expect(mockOnChange).toHaveBeenCalledWith(0);
  });

  test("handles manual input change with valid number", () => {
    const mockOnChange = jest.fn();
    render(<NumberPicker value={10} onChange={mockOnChange} isInvalid={false} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "20.5" } });
    expect(mockOnChange).toHaveBeenCalledWith(20.5);
  });

  test("handles manual input change with invalid number", () => {
    const mockOnChange = jest.fn();
    render(<NumberPicker value={10} onChange={mockOnChange} isInvalid={false} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.blur(input);
    expect(mockOnChange).toHaveBeenCalledWith(0);
  });

  test("applies invalid styling when isInvalid is true", () => {
    render(<NumberPicker value={10} onChange={() => {}} isInvalid={true} />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("text-danger");
    const wrapper = input.closest(".number-input");
    expect(wrapper).toHaveClass("border-danger");
  });

  test("performs calculation on blur", () => {
    const mockOnCalculate = jest.fn();
    render(
      <NumberPicker
        value={10}
        onChange={() => {}}
        onCalculate={mockOnCalculate}
        isInvalid={false}
      />
    );
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "15" } });
    fireEvent.blur(input);
    expect(mockOnCalculate).toHaveBeenCalledWith(15);
  });
});