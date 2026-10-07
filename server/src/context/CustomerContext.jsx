import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const CustomerContext = createContext(null);

export function CustomerProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("tn_customer_token"));
  const [customer, setCustomer] = useState(null);
  const [ready, setReady] = useState(false);

  // Load customer info when token exists
  useEffect(() => {
    if (!token) {
      setCustomer(null);
      setReady(true);
      return;
    }
    api
      .get("/customers/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => setCustomer(r.data))
      .catch(() => {
        localStorage.removeItem("tn_customer_token");
        setToken(null);
        setCustomer(null);
      })
      .finally(() => setReady(true));
  }, [token]);

  const signup = async ({ name, mobile, email, password }) => {
    const { data } = await api.post("/customers/signup", { name, mobile, email, password });
    localStorage.setItem("tn_customer_token", data.token);
    setToken(data.token);
    setCustomer(data.customer);
    return data.customer;
  };

  const login = async ({ mobile, password }) => {
    const { data } = await api.post("/customers/login", { mobile, password });
    localStorage.setItem("tn_customer_token", data.token);
    setToken(data.token);
    setCustomer(data.customer);
    return data.customer;
  };

  const logout = () => {
    localStorage.removeItem("tn_customer_token");
    setToken(null);
    setCustomer(null);
  };

  const refresh = async () => {
    if (!token) return;
    const { data } = await api.get("/customers/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCustomer(data);
  };

  return (
    <CustomerContext.Provider
      value={{
        token,
        customer,
        isLoggedIn: !!customer,
        ready,
        signup,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomer = () => {
  const ctx = useContext(CustomerContext);
  if (!ctx) throw new Error("useCustomer must be used inside CustomerProvider");
  return ctx;
};