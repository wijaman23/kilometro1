import { createContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  const setToken = (newToken) => {
    if (!newToken) {
      localStorage.removeItem("token");
      setTokenState("");
      setUser(null);
      return;
    }

    localStorage.setItem("token", newToken);
    setTokenState(newToken);

    try {
      const decoded = jwtDecode(newToken);
      setUser(decoded);
    } catch {
      setUser(null);
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
      setUser(null);
    }
  }, [token]);

  const value = useMemo(() => ({ token, user, setToken }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
