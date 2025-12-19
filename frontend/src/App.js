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
import Achievements from "./pages/achievements/Achievements";

/* =========================
   ADMIN
   ========================= */
import AdminPanel from "./pages/admin/AdminPanel";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminNews from "./pages/admin/AdminNews";
import AdminRaces from "./pages/admin/AdminRaces";
import AdminAchievements from "./pages/admin/AdminAchievements";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";

/* =========================
   RUTA PRIVADA (USUARIO)
   ========================= */
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

/* =========================
   RUTA SOLO PARA USUARIOS NO "VIDEO"
   ========================= */
const NonVideoRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if (user.role === "video") return <Navigate to="/videos" />;

  return children;
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
                <NonVideoRoute>
                  <Dashboard />
                </NonVideoRoute>
              </PrivateRoute>
            }
          />

          {/* VÍDEOS (VISIBLE PARA TODOS LOS ROLES LOGUEADOS) */}
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
                <NonVideoRoute>
                  <NewsList />
                </NonVideoRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/news/:id"
            element={
              <PrivateRoute>
                <NonVideoRoute>
                  <NewsDetail />
                </NonVideoRoute>
              </PrivateRoute>
            }
          />

          {/* CARRERAS */}
          <Route
            path="/races"
            element={
              <PrivateRoute>
                <NonVideoRoute>
                  <Races />
                </NonVideoRoute>
              </PrivateRoute>
            }
          />

          <Route
            path="/races/:id"
            element={
              <PrivateRoute>
                <NonVideoRoute>
                  <RaceDetail />
                </NonVideoRoute>
              </PrivateRoute>
            }
          />

          {/* LOGROS */}
          <Route
            path="/logros"
            element={
              <PrivateRoute>
                <NonVideoRoute>
                  <Achievements />
                </NonVideoRoute>
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
            <Route path="logros" element={<AdminAchievements />} />
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
