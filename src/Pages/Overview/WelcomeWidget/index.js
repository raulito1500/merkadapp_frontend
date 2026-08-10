import React from "react";
import { useAuth } from "../../../App/Context/auth";

function WelcomeWidget() {
    const { user } = useAuth();
    const firstName = user.displayName?.split(" ")[0] ?? user.email.split("@")[0];

    return (
        <>
            <h1 className="m-0">Hi, {firstName}!</h1>
            <p className="m-0">Are you ready to start saving?</p>
        </>
    )
}
export { WelcomeWidget }
