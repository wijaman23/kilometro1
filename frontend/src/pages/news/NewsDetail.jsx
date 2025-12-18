import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import { jwtDecode } from "jwt-decode";
import { formatDate } from "../../utils/date";

export default function NewsDetail() {
  const { id } = useParams();

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [visible, setVisible] = useState(2);
  const [text, setText] = useState("");

  /* =========================
     CARGA DE DATOS
     ========================= */
  const loadComments = useCallback(() => {
    api.get(`/news/${id}/comments`).then((res) => setComments(res.data));
  }, [id]);

  useEffect(() => {
    api.get("/news").then((res) => {
      setNews(res.data.find((n) => n._id === id));
    });

    loadComments();
  }, [id, loadComments]);

  if (!news) return null;

  /* =========================
     COMENTARIOS
     ========================= */
  const createComment = async () => {
    if (!text.trim()) return;
    await api.post(`/news/${id}/comments`, { text });
    setText("");
    loadComments();
  };

  const deleteComment = async (cid) => {
    await api.delete(`/news/comments/${cid}`);
    loadComments();
  };

  const editComment = async (cid, currentText) => {
    const newText = prompt("Editar comentario", currentText);
    if (!newText) return;
    await api.put(`/news/comments/${cid}`, { text: newText });
    loadComments();
  };

  const disableComment = async (cid) => {
    await api.put(`/news/comments/${cid}/disable`);
    loadComments();
  };

  const enableComment = async (cid) => {
    await api.put(`/news/comments/${cid}/enable`);
    loadComments();
  };

  return (
    <>
      <Navbar />

      <div className="container my-4" style={{ maxWidth: 900 }}>
        {/* =========================
            NOTICIA
           ========================= */}
        <div className="card shadow-sm mb-4">
          {news.imageUrl && (
            <img
              src={news.imageUrl}
              alt={news.title}
              className="card-img-top"
              style={{
                maxHeight: 280,
                objectFit: "cover",
              }}
            />
          )}

          <div className="card-body">
            <h2 className="fw-bold mb-2">{news.title}</h2>

            <div className="text-muted mb-3">
              ✍️ {news.author.firstName} {news.author.lastName} ·{" "}
              {formatDate(news.createdAt)}
            </div>

            <p style={{ lineHeight: 1.7 }}>{news.content}</p>
          </div>
        </div>

        {/* =========================
            COMENTARIOS
           ========================= */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">💬 Comentarios ({comments.length})</h5>

            {/* LISTADO */}
            {comments.slice(0, visible).map((c) => (
              <div
                key={c._id}
                className={`border rounded p-3 mb-3 ${
                  c.isDisabled ? "bg-light text-muted" : ""
                }`}
              >
                <div className="d-flex justify-content-between">
                  <strong>{c.user.username}</strong>
                  <small className="text-muted">
                    {new Date(c.createdAt).toLocaleString()}
                  </small>
                </div>

                {c.isDisabled && (
                  <span className="badge bg-secondary my-2">
                    Comentario desactivado
                  </span>
                )}

                {c.editedAt && (
                  <span className="badge bg-warning text-dark ms-2">
                    editado
                  </span>
                )}

                <p className="mt-2 mb-2">{c.text}</p>

                <div className="d-flex gap-2">
                  {/* AUTOR */}
                  {user?.id === c.user._id && !c.isDisabled && (
                    <>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteComment(c._id)}
                      >
                        Borrar
                      </button>

                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => editComment(c._id, c.text)}
                      >
                        Editar
                      </button>
                    </>
                  )}

                  {/* ADMIN */}
                  {user?.role === "admin" &&
                    (c.isDisabled ? (
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => enableComment(c._id)}
                      >
                        Reactivar
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => disableComment(c._id)}
                      >
                        Desactivar
                      </button>
                    ))}
                </div>
              </div>
            ))}

            {/* VER MÁS */}
            {visible < comments.length && (
              <button
                className="btn btn-link"
                onClick={() => setVisible((v) => v + 3)}
              >
                Ver más comentarios ↓
              </button>
            )}

            <hr />

            {/* ESCRIBIR COMENTARIO */}
            <h6 className="mb-2">✍️ Escribe un comentario</h6>

            <textarea
              className="form-control mb-2"
              rows="3"
              placeholder="Escribe tu comentario..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button className="btn btn-danger" onClick={createComment}>
              Comentar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
