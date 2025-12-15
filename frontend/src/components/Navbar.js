import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (!token) return null;

  const { role } = jwtDecode(token);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path ? "active-link" : "";

  return (
    <>
      <style>{`
        .navbar-dark-custom {
          background-color: #111;
          border-bottom: 1px solid #222;
        }

        .nav-link-custom {
          color: #ddd !important;
          position: relative;
          transition: color 0.2s ease;
        }

        .nav-link-custom:hover {
          color: #fff !important;
        }

        .nav-link-custom::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0%;
          height: 2px;
          background-color: #dc3545;
          transition: width 0.3s ease;
        }

        .nav-link-custom:hover::after,
        .active-link::after {
          width: 100%;
        }

        .active-link {
          color: #fff !important;
          font-weight: 600;
        }

        .admin-badge {
          background-color: #ffc107;
          color: #000;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 6px;
          margin-left: 6px;
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-dark-custom">
        <div className="container">
          {/* LOGO */}
          <Link
            to="/dashboard"
            className="navbar-brand fw-bold text-white"
            style={{ letterSpacing: "1px" }}
          >
            Kilómetro 1
          </Link>

          {/* HAMBURGUESA */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* CONTENIDO */}
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav mx-auto gap-lg-4 text-center">
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link nav-link-custom ${isActive(
                    "/dashboard"
                  )}`}
                >
                  Inicio
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/videos"
                  className={`nav-link nav-link-custom ${isActive(
                    "/videos"
                  )}`}
                >
                  Vídeos
                </Link>
              </li>

              <li className="nav-item">
                <span className="nav-link nav-link-custom text-muted">
                  Carreras
                </span>
              </li>

              <li className="nav-item">
                <span className="nav-link nav-link-custom text-muted">
                  Logros
                </span>
              </li>
            </ul>

            {/* DERECHA */}
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {role === "admin" && (
                <Link
                  to="/admin"
                  className={`nav-link nav-link-custom ${isActive(
                    "/admin"
                  )}`}
                >
                  Admin
                  <span className="admin-badge">ADMIN</span>
                </Link>
              )}

              <button
                className="btn btn-sm btn-outline-light"
                onClick={logout}
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
