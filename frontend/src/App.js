import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { jwtDecode } from "jwt-decode";

import { AuthProvider, AuthContext } from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";

import Dashboard from "./pages/Dashboard";
import Videos from "./pages/Videos";
import NewsList from "./pages/news/NewsList";
import NewsDetail from "./pages/news/NewsDetail";
import Races from "./pages/races/RaceList";
import RaceDetail from "./pages/races/RaceDetail";
import Achievements from "./pages/achievements/Achievements";

import AdminPanel from "./pages/admin/AdminPanel";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminNews from "./pages/admin/AdminNews";
import AdminRaces from "./pages/admin/AdminRaces";
import AdminAchievements from "./pages/admin/AdminAchievements";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" replace />;
};

// ✅ NO depende de user; decodifica rol desde token
const NonVideoRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode(token);
    if (decoded?.role === "video") return <Navigate to="/videos" replace />;
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Usuario */}
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

          {/* Admin */}
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

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
