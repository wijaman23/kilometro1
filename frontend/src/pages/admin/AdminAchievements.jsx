import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    athleteName: "",
    description: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadAchievements = async () => {
    const res = await api.get("/achievements");
    setAchievements(res.data);
  };

  useEffect(() => {
    loadAchievements();
  }, []);

  const createAchievement = async () => {
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
      await api.post("/achievements", data);
      setForm({ title: "", athleteName: "", description: "" });
      setImage(null);
      loadAchievements();
      alert("Logro creado");
    } catch {
      alert("Error creando logro");
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
    <div>
      <h2>Logros</h2>

      <div className="card p-3 mb-4">
        <h5>Nuevo logro</h5>

        <input
          className="form-control mb-2"
          placeholder="Título del logro"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="Nombre del atleta"
          value={form.athleteName}
          onChange={(e) =>
            setForm({ ...form, athleteName: e.target.value })
          }
        />

        <textarea
          className="form-control mb-2"
          placeholder="Descripción corta"
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="file"
          className="form-control mb-3"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          className="btn btn-success"
          onClick={createAchievement}
          disabled={loading}
        >
          {loading ? "Subiendo..." : "Crear logro"}
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Atleta</th>
            <th>Título</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {achievements.map((a) => (
            <tr key={a._id}>
              <td>{a.athleteName}</td>
              <td>{a.title}</td>
              <td>
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
  );
}
