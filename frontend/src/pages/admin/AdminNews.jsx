import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState(null);

  const loadNews = async () => {
    const res = await api.get("/news");
    setNews(res.data);
  };

  useEffect(() => {
    loadNews();
  }, []);

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageUrl("");
    setEditingId(null);
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = { title, content, imageUrl };

    if (editingId) {
      await api.put(`/news/${editingId}`, payload);
    } else {
      await api.post("/news", payload);
    }

    resetForm();
    loadNews();
  };

  const edit = (n) => {
    setEditingId(n._id);
    setTitle(n.title);
    setContent(n.content);
    setImageUrl(n.imageUrl || "");
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar noticia?")) return;
    await api.delete(`/news/${id}`);
    loadNews();
  };

  return (
    <div className="container">
      <h3 className="mb-3">📰 Gestión de noticias</h3>

      <form onSubmit={submit} className="mb-4">
        <input
          className="form-control mb-2"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="url"
          className="form-control mb-2"
          placeholder="URL de imagen (opcional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Contenido"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <button className="btn btn-danger">
          {editingId ? "Actualizar" : "Crear"} noticia
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-secondary ms-2"
            onClick={resetForm}
          >
            Cancelar
          </button>
        )}
      </form>

      {news.map((n) => (
        <div key={n._id} className="border rounded p-3 mb-3">
          <h5>{n.title}</h5>

          {n.imageUrl && (
            <img
              src={n.imageUrl}
              alt=""
              className="img-fluid rounded mb-2"
              style={{ maxHeight: 150, objectFit: "cover" }}
            />
          )}

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={() => edit(n)}
            >
              Editar
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => remove(n._id)}
            >
              Borrar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
