// src/pages/admin/AdminPanel.jsx

import { Link, Outlet, useLocation } from "react-router-dom";

/**
 * AdminPanel
 * ------------
 * Componente contenedor del panel de administración.
 * Muestra las pestañas (Usuarios / Vídeos / Noticias)
 * y renderiza el contenido correspondiente mediante <Outlet />.
 */
export default function AdminPanel() {
  const location = useLocation();

  /**
   * Marca como activo el botón según la ruta actual
   */
  const isActive = (path) =>
    location.pathname.includes(path) ? "btn-danger" : "btn-outline-danger";

  return (
    <>
      {/* BOTONES DE NAVEGACIÓN ADMIN */}
      <div className="mb-4 d-flex gap-2 flex-wrap">
        <Link to="users" className={`btn ${isActive("users")}`}>
          Usuarios
        </Link>

        <Link to="videos" className={`btn ${isActive("videos")}`}>
          Vídeos
        </Link>

        <Link to="news" className={`btn ${isActive("news")}`}>
          Noticias
        </Link>
        <Link to="races" className={`btn ${isActive("races")}`}>
          Carreras
        </Link>
      </div>

      {/* CONTENIDO DINÁMICO */}
      <Outlet />
    </>
  );
}
