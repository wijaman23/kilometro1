import { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext();

/**
 * AuthProvider
 * - Guarda token en state
 * - Persistencia en localStorage
 * - Se recupera al arrancar (muy importante en producción)
 */
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem("token") || "");

  const setToken = (newToken) => {
    if (!newToken) {
      localStorage.removeItem("token");
      setTokenState("");
      return;
    }

    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mustChangeUserId");
    setTokenState("");
  };

  // Por si el usuario abre otra pestaña y se desloguea/loguea
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") {
        setTokenState(e.newValue || "");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(() => ({ token, setToken, logout }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
