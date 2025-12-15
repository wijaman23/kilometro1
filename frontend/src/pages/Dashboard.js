import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <Navbar />

      <div className="container mt-5">
        {/* TÍTULO */}
        <h2 className="fw-bold mb-2">
          Bienvenido a Kilómetro 1 🏃‍♂️
        </h2>
        <p className="text-muted">
          Aquí verás carreras, logros y vídeos del grupo.
        </p>

        {/* TARJETAS */}
        <div className="row g-4 mt-4">
          {/* CARRERAS */}
          <div className="col-md-4">
            <div className="card p-4 shadow-sm h-100 dashboard-box">
              <h5 className="fw-semibold">Carreras</h5>
              <p className="text-muted mb-0">En preparación</p>
            </div>
          </div>

          {/* LOGROS */}
          <div className="col-md-4">
            <div className="card p-4 shadow-sm h-100 dashboard-box">
              <h5 className="fw-semibold">Logros</h5>
              <p className="text-muted mb-0">En preparación</p>
            </div>
          </div>

          {/* VÍDEOS (ENLACE) */}
          <div className="col-md-4">
            <Link to="/videos" className="text-decoration-none">
              <div className="card p-4 shadow-sm h-100 dashboard-box dashboard-link">
                <h5 className="fw-semibold text-dark">Vídeos</h5>
                <p className="text-muted mb-0">
                  Ver vídeos del grupo
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
