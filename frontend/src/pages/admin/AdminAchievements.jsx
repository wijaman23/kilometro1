import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({ title: "", athleteName: "", description: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const loadAchievements = async () => {
    const res = await api.get("/achievements");
    setAchievements(res.data);
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const createAchievement = async () => {
    if (!form.title.trim() || !form.athleteName.trim()) {
      alert("Título y nombre del atleta son obligatorios");
      return;
    }
    if (!image) {
      alert("Debes seleccionar una imagen");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("athleteName", form.athleteName);
    data.append("description", form.description);
    data.append("image", image);

    try {
      setLoading(true);
      await api.post("/achievements", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ title: "", athleteName: "", description: "" });
      setImage(null);
      setPreview("");
      await loadAchievements();
      alert("Logro creado");
    } catch (e) {
      alert(e.response?.data?.msg || "Error creando logro");
    } finally {
      setLoading(false);
    }
  };

  const deleteAchievement = async (id) => {
    if (!window.confirm("¿Eliminar este logro?")) return;
    await api.delete(`/achievements/${id}`);
    loadAchievements();
  };

  return (
    <>
      <div className="container mt-4">
        <h2 className="mb-3">🏆 Logros</h2>

        <div className="card p-3 mb-4 shadow-sm">
          <h5 className="mb-3">Nuevo logro</h5>

          <div className="row g-2">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Título del logro"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Nombre del atleta"
                value={form.athleteName}
                onChange={(e) => setForm({ ...form, athleteName: e.target.value })}
              />
            </div>

            <div className="col-12">
              <textarea
                className="form-control"
                placeholder="Descripción corta (historia breve)"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="col-md-8">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImage(file || null);
                  setPreview(file ? URL.createObjectURL(file) : "");
                }}
              />
            </div>

            <div className="col-md-4 d-grid">
              <button
                className="btn btn-success"
                onClick={createAchievement}
                disabled={loading}
              >
                {loading ? "Subiendo..." : "Crear logro"}
              </button>
            </div>

            {preview && (
              <div className="col-12">
                <div className="border rounded p-2 d-flex gap-3 align-items-center">
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      width: 90,
                      height: 90,
                      objectFit: "cover",
                      borderRadius: 12,
                    }}
                  />
                  <div className="text-muted small">
                    Vista previa (se subirá a Cloudinary)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Logros existentes</h5>

            {achievements.length === 0 ? (
              <div className="text-muted">Aún no hay logros</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th style={{ width: 90 }}>Foto</th>
                      <th>Atleta</th>
                      <th>Título</th>
                      <th style={{ width: 110 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {achievements.map((a) => (
                      <tr key={a._id}>
                        <td>
                          <img
                            src={a.imageUrl}
                            alt={a.title}
                            style={{
                              width: 70,
                              height: 70,
                              objectFit: "cover",
                              borderRadius: 12,
                            }}
                          />
                        </td>
                        <td className="fw-semibold">{a.athleteName}</td>
                        <td>{a.title}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteAchievement(a._id)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
