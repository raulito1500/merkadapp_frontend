import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthContext } from "../../App/Context/auth";
import { Login } from ".";

const renderLogin = (login = jest.fn()) => {
    render(
        <AuthContext.Provider value={{ login }}>
            <Login />
        </AuthContext.Provider>
    );
    return login;
};

describe("Login component", () => {
    test("renders the welcome title and subtitle", () => {
        renderLogin();
        expect(screen.getByText("Welcome back")).toBeInTheDocument();
        expect(screen.getByText("Sign in to continue to Merkadapp.")).toBeInTheDocument();
    });

    test("renders username and password fields", () => {
        renderLogin();
        expect(screen.getByPlaceholderText("Enter your username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    });

    test("updates username and password as the user types", () => {
        renderLogin();
        const username = screen.getByPlaceholderText("Enter your username");
        const password = screen.getByPlaceholderText("Enter your password");

        fireEvent.change(username, { target: { value: "raul" } });
        fireEvent.change(password, { target: { value: "secret" } });

        expect(username).toHaveValue("raul");
        expect(password).toHaveValue("secret");
    });

    test("password field is masked by default and toggles visibility", () => {
        renderLogin();
        const password = screen.getByPlaceholderText("Enter your password");
        expect(password).toHaveAttribute("type", "password");

        fireEvent.click(screen.getByRole("button", { name: "Show password" }));
        expect(password).toHaveAttribute("type", "text");

        fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
        expect(password).toHaveAttribute("type", "password");
    });

    test("calls login with the entered username on submit", () => {
        const login = renderLogin();
        const username = screen.getByPlaceholderText("Enter your username");
        fireEvent.change(username, { target: { value: "raul" } });

        fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

        expect(login).toHaveBeenCalledWith({ username: "raul" });
    });

    test("renders forgot password and sign up links", () => {
        renderLogin();
        expect(screen.getByText("Forgot password?")).toBeInTheDocument();
        expect(screen.getByText("Sign up")).toBeInTheDocument();
    });

    test("renders the remember me checkbox unchecked by default", () => {
        renderLogin();
        const checkbox = screen.getByLabelText("Remember me");
        expect(checkbox).not.toBeChecked();
    });
});
