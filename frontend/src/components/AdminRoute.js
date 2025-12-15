import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" />;

  const decoded = jwtDecode(token);
  return decoded.role === "admin" ? children : <Navigate to="/dashboard" />;
}
