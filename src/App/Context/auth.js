import React from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProvider({ children }) {
    const [user, setUser] = React.useState(null);
    const [gitHubID, setGitHubID] = React.useState("0");
    const navigate = useNavigate();

    const login = ({ username }) => {
        if (username === "rau") {
            setUser(username);
            setGitHubID("817891")
            navigate('/');
        }
        else if (username === "manu") {
            setUser(username);
            setGitHubID("108774676")
            navigate('/');
        }
    }

    const logout = () => {
        setUser(null);
        navigate('/login')
    }
    const isAuthenticated = () => {
        return (user !== null)
    }
    const auth = {
        user, login, logout, gitHubID, isAuthenticated
    }
    return (
        <AuthContext.Provider
            value={
                auth
            }>{children}</AuthContext.Provider>
    );
}

function useAuth() {
    const auth = React.useContext(AuthContext);
    return auth;
}

export { AuthProvider, useAuth };