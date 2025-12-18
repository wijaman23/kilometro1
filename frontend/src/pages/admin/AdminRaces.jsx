import { useEffect, useState } from "react";
import api from "../../services/api";

export default function AdminRaces() {
  const [races, setRaces] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    title: "",
    city: "",
    date: "",
    image: "",
    description: "",
    distances: [],
  };

  const [form, setForm] = useState(emptyForm);

  /* =====================
     CARGAR CARRERAS
     ===================== */
  const load = async () => {
    const res = await api.get("/races");
    setRaces(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  /* =====================
     DISTANCIAS
     ===================== */
  const addDistance = () => {
    setForm({
      ...form,
      distances: [...form.distances, { label: "10K", km: 10 }],
    });
  };

  const updateDistance = (i, key, value) => {
    const copy = [...form.distances];
    copy[i][key] = value;
    setForm({ ...form, distances: copy });
  };

  const removeDistance = (i) => {
    const copy = [...form.distances];
    copy.splice(i, 1);
    setForm({ ...form, distances: copy });
  };

  /* =====================
     GUARDAR / EDITAR
     ===================== */
  const save = async () => {
    if (editingId) {
      await api.put(`/races/${editingId}`, form);
    } else {
      await api.post("/races", form);
    }

    setForm(emptyForm);
    setEditingId(null);
    load();
  };

  /* =====================
     EDITAR EXISTENTE
     ===================== */
  const editRace = (race) => {
    setEditingId(race._id);
    setForm({
      title: race.title,
      city: race.city,
      date: race.date.slice(0, 10),
      image: race.image || "",
      description: race.description || "",
      distances: race.distances || [],
    });
  };

  /* =====================
     BORRAR
     ===================== */
  const deleteRace = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar esta carrera?")) return;
    await api.delete(`/races/${id}`);
    load();
  };

  return (
    <div className="container">
      <h3 className="mb-3">🏁 {editingId ? "Editar carrera" : "Nueva carrera"}</h3>

      <input
        className="form-control mb-2"
        placeholder="Título"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        className="form-control mb-2"
        placeholder="Ciudad"
        value={form.city}
        onChange={(e) => setForm({ ...form, city: e.target.value })}
      />

      <input
        type="date"
        className="form-control mb-2"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <input
        className="form-control mb-2"
        placeholder="URL imagen"
        value={form.image}
        onChange={(e) => setForm({ ...form, image: e.target.value })}
      />

      <textarea
        className="form-control mb-2"
        rows="4"
        placeholder="Descripción de la carrera"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
      />

      <button
        className="btn btn-outline-primary mb-3"
        onClick={addDistance}
      >
        ➕ Añadir distancia
      </button>

      {form.distances.map((d, i) => (
        <div key={i} className="d-flex gap-2 mb-2">
          <select
            className="form-select"
            value={d.label}
            onChange={(e) =>
              updateDistance(i, "label", e.target.value)
            }
          >
            <option>5K</option>
            <option>10K</option>
            <option>21K</option>
            <option>42K</option>
            <option>OTROS</option>
          </select>

          <input
            type="number"
            className="form-control"
            value={d.km}
            onChange={(e) =>
              updateDistance(i, "km", Number(e.target.value))
            }
          />

          <button
            className="btn btn-outline-danger"
            onClick={() => removeDistance(i)}
          >
            ✖
          </button>
        </div>
      ))}

      <div className="mb-4">
        <button className="btn btn-danger" onClick={save}>
          {editingId ? "Actualizar carrera" : "Guardar carrera"}
        </button>

        {editingId && (
          <button
            className="btn btn-secondary ms-2"
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
            }}
          >
            Cancelar
          </button>
        )}
      </div>

      <hr />

      <h4>📋 Carreras existentes</h4>

      {races.map((r) => (
        <div
          key={r._id}
          className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
        >
          <div>
            <strong>{r.title}</strong>{" "}
            <span className="text-muted">
              ({new Date(r.date).toLocaleDateString("es-ES")})
            </span>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-outline-warning"
              onClick={() => editRace(r)}
            >
              Editar
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => deleteRace(r._id)}
            >
              Borrar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
