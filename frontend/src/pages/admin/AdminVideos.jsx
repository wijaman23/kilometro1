//AdminVideos.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import { convertToEmbed } from "../../utils/convertToEmbed";

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    url: "",
    publishDate: "",
  });

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    const res = await api.get("/videos");
    setVideos(res.data);
  };

  const createVideo = async () => {
    const embedUrl = convertToEmbed(newVideo.url);

    if (!embedUrl) {
      alert("URL no válida (YouTube, Loom o Vimeo)");
      return;
    }

    await api.post("/videos", {
      title: newVideo.title,
      description: newVideo.description,
      embedUrl,
      publishDate: newVideo.publishDate,
    });

    setNewVideo({
      title: "",
      description: "",
      url: "",
      publishDate: "",
    });

    loadVideos();
  };

  return (
    <div className="container mt-4">
      <h2>Admin · Vídeos 🎥</h2>

      {/* CREAR */}
      <div className="card p-3 mb-4">
        <h5>Nuevo vídeo</h5>

        <input
          className="form-control mb-2"
          placeholder="Título"
          value={newVideo.title}
          onChange={(e) =>
            setNewVideo({ ...newVideo, title: e.target.value })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="URL del vídeo (YouTube, Loom, Vimeo)"
          value={newVideo.url}
          onChange={(e) =>
            setNewVideo({ ...newVideo, url: e.target.value })
          }
        />

        <textarea
          className="form-control mb-2"
          placeholder="Descripción"
          value={newVideo.description}
          onChange={(e) =>
            setNewVideo({ ...newVideo, description: e.target.value })
          }
        />

        <input
          type="date"
          className="form-control mb-2"
          value={newVideo.publishDate}
          onChange={(e) =>
            setNewVideo({ ...newVideo, publishDate: e.target.value })
          }
        />

        <button className="btn btn-success" onClick={createVideo}>
          Crear vídeo
        </button>
      </div>

      {/* LISTADO */}
      {videos.map((v) => (
        <div key={v._id} className="card p-3 mb-3">
          <h5>{v.title}</h5>
          <p>{v.description}</p>
          <small className="text-muted">
            Fecha: {new Date(v.publishDate).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}
