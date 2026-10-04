import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("tn_admin_token"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/admin-login", { username, password });
    localStorage.setItem("tn_admin_token", data.token);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem("tn_admin_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin: !!token, ready, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);