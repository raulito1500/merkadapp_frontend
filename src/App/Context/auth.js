import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../../Pages/Login";

const AuthContext = React.createContext();

const STORAGE_KEY = "merkadapp_username";
const GITHUB_IDS = { raul: "817891", manuel: "108774676" };

function AuthProvider({ children }) {

    const [user, setUser] = React.useState(() => localStorage.getItem(STORAGE_KEY));
    const [gitHubID, setGitHubID] = React.useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? GITHUB_IDS[stored] ?? "0" : "0";
    });

    const navigate = useNavigate();

    const login = ({ username }) => {
        if (GITHUB_IDS[username]) {
            setUser(username);
            setGitHubID(GITHUB_IDS[username]);
            localStorage.setItem(STORAGE_KEY, username);
            navigate('/');
        }
    }

    const logout = () => {
        setUser(null);
        setGitHubID("0");
        localStorage.removeItem(STORAGE_KEY);
        navigate('/login')
    }

    const isAuthenticated = () => {
        return (user !== null)
    }

    const auth = useMemo(() => ({
        user,
        login,
        logout,
        gitHubID,
        isAuthenticated
    }), [user, gitHubID]);

    return (
        <AuthContext.Provider value={auth}>
            {isAuthenticated() ? children : <Login />}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return React.useContext(AuthContext);
}

export { AuthProvider, useAuth };