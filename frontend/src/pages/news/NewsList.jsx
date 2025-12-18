import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

export default function NewsList() {
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);

  const PER_PAGE = 3;

  useEffect(() => {
    api.get("/news").then((res) => setNews(res.data));
  }, []);

  const totalPages = Math.ceil(news.length / PER_PAGE);
  const visible = news.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  return (
    <>
      <Navbar />

      {/* Fondo suave tipo periódico */}
      <div
        className="py-4"
        style={{ backgroundColor: "#f6f7f8", minHeight: "100vh" }}
      >
        <div className="container">
          <h2 className="mb-4 fw-bold">📰 Noticias</h2>

          {/* LISTADO */}
          <div className="d-flex flex-column gap-3">
            {visible.map((n) => (
              <div
                key={n._id}
                className="card border-0 shadow-sm"
                style={{ transition: "transform .2s" }}
              >
                <div className="row g-0 align-items-center">
                  {/* IMAGEN */}
                  <div className="col-md-4">
                    {n.imageUrl ? (
                      <img
                        src={n.imageUrl}
                        alt={n.title}
                        className="img-fluid rounded-start"
                        style={{
                          height: 160,
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center text-muted"
                        style={{ height: 160 }}
                      >
                        Sin imagen
                      </div>
                    )}
                  </div>

                  {/* CONTENIDO */}
                  <div className="col-md-8">
                    <div className="card-body py-3">
                      <h5 className="fw-bold mb-1">
                        {n.title}
                      </h5>

                      <div className="text-muted small mb-2">
                        📅{" "}
                        {new Date(n.createdAt).toLocaleDateString(
                          "es-ES"
                        )}{" "}
                        · 💬 {n.commentsCount || 0} comentarios
                      </div>

                      <p className="mb-2 text-secondary">
                        {n.content.length > 180
                          ? n.content.slice(0, 180) + "..."
                          : n.content}
                      </p>

                      <Link
                        to={`/news/${n._id}`}
                        className="btn btn-sm btn-danger"
                      >
                        Leer más →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center gap-2 mt-4">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn btn-sm ${
                    page === i + 1
                      ? "btn-danger"
                      : "btn-outline-danger"
                  }`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
