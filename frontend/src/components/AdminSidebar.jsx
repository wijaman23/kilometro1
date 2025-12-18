import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `d-block px-4 py-3 text-decoration-none ${
      isActive ? "bg-danger text-white" : "text-light"
    }`;

  return (
    <div>
      <h5 className="px-4 py-3 border-bottom border-secondary">Panel Admin</h5>

      <NavLink to="users" className={linkClass}>
        👤 Usuarios
      </NavLink>

      <NavLink to="videos" className={linkClass}>
        🎥 Vídeos
      </NavLink>

      <NavLink className="nav-link" to="/admin/news">
        Noticias
      </NavLink>
    </div>
  );
}
