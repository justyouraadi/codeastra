import React, { createContext, useContext } from "react";
import { useAuthProvider } from "../hooks/useAuthProvider";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const auth = useAuthProvider();
   
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
