import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BudgetWidget } from ".";

test("renders no data available when data is empty", () => {
    render(<BudgetWidget data={[]} />);
    expect(screen.getByText("No data available")).toBeInTheDocument();
});

test("renders month name when data is provided", () => {
    const data = [
        { total: 0, date: "2023-09-01" },
        { total: 0, date: "2023-10-01" },
    ];
    render(<BudgetWidget data={data} />);
    expect(screen.getByText("October")).toBeInTheDocument();
});

test("renders budget amount when data is provided", () => {
    const data = [
        { total: 0, date: "2023-09-01" },
        { total: 1500, date: "2023-10-01" },
    ];
    render(<BudgetWidget data={data} />);
    expect(screen.getByText("$1500")).toBeInTheDocument();
});

test("renders budget variation with one month provided", () => {
    const data = [{ total: 1500, date: "2023-10-01" }];
    render(<BudgetWidget data={data} />);

    const variationElement = screen.getByText("100,0%");

    expect(variationElement).toBeInTheDocument();
    expect(variationElement).toHaveClass("text-danger");
});

test("renders budget positive variation when full data is provided", () => {
    const data = [
        { total: 1000, date: "2023-09-01" },
        { total: 1500, date: "2023-10-01" },
    ];
    render(<BudgetWidget data={data} />);
    const variationElement = screen.getByText("50,0%");

    expect(variationElement).toBeInTheDocument();
    expect(variationElement).toHaveClass("text-danger");
});

test("renders budget variation with non-current data provided", () => {
    const data = [
        { total: 1500, date: "2023-09-01" },
        { total: 0, date: "2023-10-01" },
    ];
    render(<BudgetWidget data={data} />);
    const variationElement = screen.getByText("-100,0%");

    expect(variationElement).toBeInTheDocument();
    expect(variationElement).toHaveClass("text-success");
});

test("renders budget variation when data is zero", () => {
    const data = [
        { total: 0, date: "2023-09-01" },
        { total: 0, date: "2023-10-01" },
    ];
    render(<BudgetWidget data={data} />);
    const variationElement = screen.getByText("0,0%");

    expect(variationElement).toBeInTheDocument();
    expect(variationElement).toHaveClass("text-success");
});
