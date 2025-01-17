import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppContext } from "../../../App/Context/app";
import { BillHistory } from ".";
import axios from "axios";
import "@testing-library/jest-dom";
import moment from "moment";

const mockData = [
    {
        id: "6784253927cc48aa9e56394d",
        date: "2025-01-11T05:00:00Z",
        where: "Euro",
        product_id: "65f50fb0f510bd96ebaede3f",
        description: "Aceite de oliva",
        brand: "Euro",
        quantity: 2,
        content: 500,
        unit: "ML",
        is_additional: false,
        unit_value: 22990,
        discount: 0,
        total: 45980,
    },
];

jest.mock("axios");

const mockContextValue = {
    api: axios,
    setLoading: jest.fn(),
    pushNotifications: jest.fn(),
};

describe("BillHistory component", () => {
    test("renders the purchase history table when data is available", async () => {
        axios.get.mockResolvedValueOnce({ data: mockData });
        render(
            <AppContext.Provider value={mockContextValue}>
                <BillHistory productId="123" />
            </AppContext.Provider>
        );

        expect(screen.getByText(/Purchase history/i)).toBeInTheDocument();

        await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/products/123/bill-items"));

        expect(await screen.findByText(mockData[0].where)).toBeInTheDocument();
        expect(await screen.findByText(`$22.990`)).toBeInTheDocument();
        expect(await screen.findByText(`${mockData[0].content} ${mockData[0].unit}`)).toBeInTheDocument();
        expect(await screen.findByText(moment(mockData[0].date).format("MMM Do, YYYY"))).toBeInTheDocument();
    });

    test("handles API errors and shows a notification", async () => {
        axios.get.mockRejectedValueOnce(new Error("API Error"));

        render(
            <AppContext.Provider value={mockContextValue}>
                <BillHistory productId="123" />
            </AppContext.Provider>
        );

        await waitFor(() =>
            expect(mockContextValue.pushNotifications).toHaveBeenCalledWith(
                "¡Ups! Something went wrong",
                expect.any(Error),
                "warning"
            )
        );
    });
});
