// src/App.js
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";

/* PÚBLICAS */
import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

/* USUARIO */
import Dashboard from "./pages/Dashboard";
import Videos from "./pages/Videos";
import NewsList from "./pages/news/NewsList";
import NewsDetail from "./pages/news/NewsDetail";
import Races from "./pages/races/RaceList";
import RaceDetail from "./pages/races/RaceDetail";
import Achievements from "./pages/achievements/Achievements";

/* ADMIN */
import AdminPanel from "./pages/admin/AdminPanel";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminNews from "./pages/admin/AdminNews";
import AdminRaces from "./pages/admin/AdminRaces";
import AdminAchievements from "./pages/admin/AdminAchievements";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";

/* RUTA PRIVADA */
const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
};

/* BLOQUEAR USUARIOS VIDEO */
const NonVideoRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) return null;
  if (user.role === "video") return <Navigate to="/videos" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* USUARIO */}
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

          <Route
            path="/videos"
            element={
              <PrivateRoute>
                <Videos />
              </PrivateRoute>
            }
          />

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

          {/* ADMIN */}
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

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
