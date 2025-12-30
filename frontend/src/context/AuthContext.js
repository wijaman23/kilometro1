import { createContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  const logout = () => {
    localStorage.removeItem("token");
    setTokenState(null);
    setUser(null);
  };

  const setToken = (newToken) => {
    if (!newToken) {
      logout();
      return;
    }

    localStorage.setItem("token", newToken);
    setTokenState(newToken);

    try {
      setUser(jwtDecode(newToken));
    } catch {
      // token corrupto
      logout();
    }
  };

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    try {
      setUser(jwtDecode(token));
    } catch {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(() => ({ token, user, setToken, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
