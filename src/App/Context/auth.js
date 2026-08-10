import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { auth as firebaseAuth, googleProvider } from "./firebaseConfig";
import { Login } from "../../Pages/Login";

const AuthContext = React.createContext();

function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
            setUser(firebaseUser);
            setInitializing(false);
        });
        return unsubscribe;
    }, []);

    const loginWithEmailPassword = (email, password) => {
        return signInWithEmailAndPassword(firebaseAuth, email, password)
            .then(() => navigate('/'));
    }

    const loginWithGoogle = () => {
        return signInWithPopup(firebaseAuth, googleProvider)
            .then(() => navigate('/'));
    }

    const logout = () => {
        return signOut(firebaseAuth).then(() => navigate('/login'));
    }

    const isAuthenticated = () => {
        return (user !== null)
    }

    const getIdToken = () => {
        return firebaseAuth.currentUser ? firebaseAuth.currentUser.getIdToken() : Promise.resolve(null);
    }

    const auth = useMemo(() => ({
        user,
        loginWithEmailPassword,
        loginWithGoogle,
        logout,
        isAuthenticated,
        getIdToken,
    }), [user]);

    if (initializing) {
        return null;
    }

    return (
        <AuthContext.Provider value={auth}>
            {isAuthenticated() ? children : <Login />}
        </AuthContext.Provider>
    );
}

function useAuth() {
    return React.useContext(AuthContext);
}

export { AuthContext, AuthProvider, useAuth };
