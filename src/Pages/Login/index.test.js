import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthContext } from "../../App/Context/auth";
import { Login } from ".";

const renderLogin = (overrides = {}) => {
    const auth = {
        loginWithEmailPassword: jest.fn().mockResolvedValue(undefined),
        loginWithGoogle: jest.fn().mockResolvedValue(undefined),
        ...overrides,
    };
    render(
        <AuthContext.Provider value={auth}>
            <Login />
        </AuthContext.Provider>
    );
    return auth;
};

describe("Login component", () => {
    test("renders the welcome title and subtitle", () => {
        renderLogin();
        expect(screen.getByText("Welcome back")).toBeInTheDocument();
        expect(screen.getByText("Sign in to continue to Merkadapp.")).toBeInTheDocument();
    });

    test("renders email and password fields", () => {
        renderLogin();
        expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    });

    test("updates email and password as the user types", () => {
        renderLogin();
        const email = screen.getByPlaceholderText("Enter your email");
        const password = screen.getByPlaceholderText("Enter your password");

        fireEvent.change(email, { target: { value: "raul@example.com" } });
        fireEvent.change(password, { target: { value: "secret" } });

        expect(email).toHaveValue("raul@example.com");
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

    test("calls loginWithEmailPassword with the entered credentials on submit", async () => {
        const mocks = renderLogin();
        fireEvent.change(screen.getByPlaceholderText("Enter your email"), { target: { value: "raul@example.com" } });
        fireEvent.change(screen.getByPlaceholderText("Enter your password"), { target: { value: "secret" } });

        fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

        await waitFor(() =>
            expect(mocks.loginWithEmailPassword).toHaveBeenCalledWith("raul@example.com", "secret")
        );
    });

    test("shows an error message when login fails", async () => {
        renderLogin({
            loginWithEmailPassword: jest.fn().mockRejectedValue({ code: "auth/invalid-credential" }),
        });
        fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

        expect(await screen.findByText("Incorrect email or password.")).toBeInTheDocument();
    });

    test("calls loginWithGoogle when the Google button is clicked", async () => {
        const mocks = renderLogin();
        fireEvent.click(screen.getByRole("button", { name: /continue with google/i }));

        await waitFor(() => expect(mocks.loginWithGoogle).toHaveBeenCalled());
    });
});
