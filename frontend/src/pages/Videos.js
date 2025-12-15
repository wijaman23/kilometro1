import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { jwtDecode } from "jwt-decode";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [expandedVideo, setExpandedVideo] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    publishDate: "",
  });

  const token = localStorage.getItem("token");
  const isAdmin = token && jwtDecode(token).role === "admin";

  useEffect(() => {
    api.get("/videos").then((res) => {
      setVideos(res.data);
    });
  }, []);

  const deleteVideo = async (id) => {
    if (!window.confirm("¿Eliminar este vídeo?")) return;
    await api.delete(`/videos/${id}`);
    setVideos(videos.filter((v) => v._id !== id));
  };

  const saveEdit = async (id) => {
    const res = await api.put(`/videos/${id}`, editForm);
    setVideos(videos.map((v) => (v._id === id ? res.data : v)));
    setEditingVideo(null);
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h2 className="mb-4">Vídeos 🎥</h2>

        {videos.map((video) => {
          const isExpanded = expandedVideo === video._id;
          const isEditing = editingVideo === video._id;

          return (
            <div className="col-12 mb-4" key={video._id}>
              <div className="card shadow-sm" style={{ minHeight: "220px" }}>
                {isExpanded && (
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.youtubeId}`}
                      title={video.title}
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="card-body">
                  {!isEditing ? (
                    <>
                      <h5>{video.title}</h5>

                      <p className="text-muted mb-1">
                        📅{" "}
                        {new Date(video.publishDate).toLocaleDateString()}
                      </p>

                      <p className="text-muted">{video.description}</p>

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() =>
                            setExpandedVideo(
                              isExpanded ? null : video._id
                            )
                          }
                        >
                          {isExpanded ? "Ocultar vídeo" : "Ver vídeo"}
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => {
                                setEditingVideo(video._id);
                                setEditForm({
                                  title: video.title,
                                  description: video.description,
                                  publishDate:
                                    video.publishDate.slice(0, 10),
                                });
                              }}
                            >
                              ✏️ Editar
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => deleteVideo(video._id)}
                            >
                              🗑️ Borrar
                            </button>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <input
                        className="form-control mb-2"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            title: e.target.value,
                          })
                        }
                      />

                      <textarea
                        className="form-control mb-2"
                        rows="2"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                      />

                      <input
                        type="date"
                        className="form-control mb-2"
                        value={editForm.publishDate}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            publishDate: e.target.value,
                          })
                        }
                      />

                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => saveEdit(video._id)}
                        >
                          Guardar
                        </button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => setEditingVideo(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
