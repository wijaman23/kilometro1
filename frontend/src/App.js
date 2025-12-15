import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import { AuthProvider, AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Videos from "./pages/Videos";
import AdminPanel from "./pages/AdminPanel";
import AdminRoute from "./components/AdminRoute";



/**
 * Ruta privada: requiere estar logueado
 */
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* LOGIN */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* DASHBOARD (usuario) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* VIDEOS (usuario + admin) */}
          <Route
            path="/videos"
            element={
              <PrivateRoute>
                <Videos />
              </PrivateRoute>
            }
          />

          {/* PANEL ADMIN (solo admin) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />

          {/* REDIRECCIÓN POR DEFECTO */}
          <Route path="*" element={<Navigate to="/dashboard" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
