import React, { createContext, useContext } from "react";
import { useAuthProvider } from "../hooks/useAuthProvider"; // ✅ tumhara custom hook

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
const auth = useAuthProvider(); // ✅ hook call
return (
<AuthContext.Provider value={auth}>
{children}
</AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
