import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <div
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          padding: "100px 0",
        }}
      >
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">
            Kilómetro 1 🏃‍♂️
          </h1>
          <p className="lead mb-4">
            Carreras, noticias, vídeos y logros de nuestra comunidad runner
          </p>

          <div className="d-flex justify-content-center gap-3">
            <Link to="/races" className="btn btn-danger btn-lg">
              Ver Carreras
            </Link>
            <Link to="/news" className="btn btn-outline-light btn-lg">
              Noticias
            </Link>
          </div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="container my-5">

        {/* ACCESOS RÁPIDOS */}
        <div className="row g-4 mb-5">

          <div className="col-md-3">
            <Link to="/races" className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm hover-card text-center p-4">
                <div style={{ fontSize: 40 }}>🏁</div>
                <h5 className="mt-3">Carreras</h5>
                <p className="text-muted">
                  Consulta próximas carreras y eventos
                </p>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/news" className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm hover-card text-center p-4">
                <div style={{ fontSize: 40 }}>📰</div>
                <h5 className="mt-3">Noticias</h5>
                <p className="text-muted">
                  Actualidad y novedades del mundo runner
                </p>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/videos" className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm hover-card text-center p-4">
                <div style={{ fontSize: 40 }}>🎥</div>
                <h5 className="mt-3">Vídeos</h5>
                <p className="text-muted">
                  Contenido del grupo y entrenamientos
                </p>
              </div>
            </Link>
          </div>

          <div className="col-md-3">
            <Link to="/logros" className="text-decoration-none text-dark">
              <div className="card h-100 shadow-sm hover-card text-center p-4">
                <div style={{ fontSize: 40 }}>🏆</div>
                <h5 className="mt-3">Logros</h5>
                <p className="text-muted">
                  Retos y objetivos conseguidos
                </p>
              </div>
            </Link>
          </div>

        </div>

        {/* QUIÉNES SOMOS */}
        <div className="row justify-content-center">
          <div className="col-md-8 text-center">
            <h3 className="mb-3">¿Qué es Kilómetro 1?</h3>
            <p className="text-muted">
              Kilómetro 1 es una comunidad de corredores donde compartimos
              carreras, experiencias, vídeos y logros. Un punto de encuentro
              para disfrutar del running, mejorar juntos y motivarnos día a día.
            </p>
          </div>
        </div>
      </div>

      {/* HOVER EFFECT */}
      <style>{`
        .hover-card {
          transition: all 0.25s ease;
        }
        .hover-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
      `}</style>
    </>
  );
}
