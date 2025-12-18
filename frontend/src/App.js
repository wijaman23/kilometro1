// src/App.js

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

/* =========================
   CONTEXTO DE AUTENTICACIÓN
   ========================= */
import { AuthProvider, AuthContext } from "./context/AuthContext";

/* =========================
   PÁGINAS PÚBLICAS
   ========================= */
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

/* =========================
   PÁGINAS DE USUARIO
   ========================= */
import Dashboard from "./pages/Dashboard";
import Videos from "./pages/Videos";
import NewsList from "./pages/news/NewsList";
import NewsDetail from "./pages/news/NewsDetail";
import Races from "./pages/races/RaceList";
import RaceDetail from "./pages/races/RaceDetail";

/* =========================
   ADMIN
   ========================= */
import AdminPanel from "./pages/admin/AdminPanel";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminNews from "./pages/admin/AdminNews";
import AdminRaces from "./pages/admin/AdminRaces";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";

/* =========================
   RUTA PRIVADA (USUARIO)
   ========================= */
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* =========================
              RUTAS PÚBLICAS
              ========================= */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Recuperación de contraseña */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Cambio obligatorio de contraseña */}
          <Route path="/change-password" element={<ChangePassword />} />

          {/* =========================
              RUTAS DE USUARIO
              ========================= */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/videos"
            element={
              <PrivateRoute>
                <Videos />
              </PrivateRoute>
            }
          />

          {/* NOTICIAS */}
          <Route
            path="/news"
            element={
              <PrivateRoute>
                <NewsList />
              </PrivateRoute>
            }
          />

          <Route
            path="/news/:id"
            element={
              <PrivateRoute>
                <NewsDetail />
              </PrivateRoute>
            }
          />

          {/* CARRERAS */}
          <Route
            path="/races"
            element={
              <PrivateRoute>
                <Races />
              </PrivateRoute>
            }
          />
          <Route
            path="/races/:id"
            element={
              <PrivateRoute>
                <RaceDetail />
              </PrivateRoute>
            }
          />

          {/* =========================
              RUTAS DE ADMIN
              ========================= */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminPanel />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="races" element={<AdminRaces />} />
          </Route>

          {/* =========================
              FALLBACK
              ========================= */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
