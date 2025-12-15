import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const extractYoutubeId = (url) => {
  if (!url) return "";
  if (url.includes("watch?v="))
    return url.split("watch?v=")[1].split("&")[0];
  if (url.includes("youtu.be/"))
    return url.split("youtu.be/")[1].split("?")[0];
  return url.trim();
};

export default function AdminPanel() {
  // VIDEO
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [publishDate, setPublishDate] = useState("");

  // USER
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const createVideo = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    const youtubeId = extractYoutubeId(youtubeUrl);

    try {
      await api.post("/videos", {
        title,
        description,
        youtubeId,
        publishDate,
      });

      setMsg("Vídeo creado 🎥");
      setTitle("");
      setDescription("");
      setYoutubeUrl("");
      setPublishDate("");
    } catch {
      setError("Error al crear vídeo");
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      await api.post("/users", {
        username,
        password,
        role,
      });

      setMsg("Usuario creado 👤");
      setUsername("");
      setPassword("");
      setRole("user");
    } catch {
      setError("Error al crear usuario");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2>Panel de Administración ⚙️</h2>

        {/* VIDEOS */}
        <div className="card p-4 mt-4">
          <h5>Añadir vídeo</h5>

          <form onSubmit={createVideo}>
            <input
              className="form-control mb-2"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="form-control mb-2"
              placeholder="URL YouTube"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
            />

            <input
              type="date"
              className="form-control mb-2"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
            />

            <textarea
              className="form-control mb-2"
              placeholder="Descripción"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button className="btn btn-danger">Crear vídeo</button>
          </form>
        </div>

        {/* USERS */}
        <div className="card p-4 mt-4">
          <h5>Crear usuario</h5>

          <form onSubmit={createUser}>
            <input
              className="form-control mb-2"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="form-control mb-2"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              className="form-control mb-2"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>

            <button className="btn btn-dark">Crear usuario</button>
          </form>
        </div>

        {msg && <div className="alert alert-success mt-3">{msg}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
    </>
  );
}
