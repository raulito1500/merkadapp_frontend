import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Login } from "../../Pages/Login";

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

    const auth = useMemo(() => ({
        user,
        login,
        logout,
        gitHubID,
        isAuthenticated
    }), [user, gitHubID]);

    return (
        <AuthContext.Provider value={auth}>
            {true ? children : <Login />}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return React.useContext(AuthContext);
}

export { AuthProvider, useAuth };