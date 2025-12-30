import { useEffect, useState } from "react";
import api from "../../services/api";

/**
 * ADMIN - USUARIOS
 */
export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "user",
  });

  // 🔄 Cargar usuarios
  const loadUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError("Error cargando usuarios");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ➕ Crear usuario
  const createUser = async () => {
    setError("");

    if (
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.username ||
      !newUser.email
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setCreating(true);
      await api.post("/admin/users", newUser);

      setNewUser({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        role: "user",
      });

      loadUsers();
      alert("Usuario creado y email enviado");
    } catch (err) {
      setError(err.response?.data?.msg || "Error creando usuario");
    } finally {
      setCreating(false);
    }
  };

  const blockUser = async (id) => {
    if (!window.confirm("¿Bloquear este usuario?")) return;
    await api.put(`/admin/users/${id}/block`);
    loadUsers();
  };

  const unlockUser = async (id) => {
    if (!window.confirm("¿Desbloquear este usuario?")) return;
    await api.put(`/admin/users/${id}/unlock`);
    loadUsers();
  };

  return (
    <div>
      <h2>Usuarios</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card p-3 mb-4">
        <h5>Crear usuario</h5>

        <input
          className="form-control mb-2"
          placeholder="Nombre"
          value={newUser.firstName}
          onChange={(e) =>
            setNewUser({ ...newUser, firstName: e.target.value })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="Apellidos"
          value={newUser.lastName}
          onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Usuario"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />

        <input
          className="form-control mb-2"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />

        <select
          className="form-select mb-2"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="user">Usuario</option>
          <option value="video">Video</option>
          <option value="admin">Admin</option>
        </select>

        <button
          className="btn btn-success"
          onClick={createUser}
          disabled={creating}
        >
          {creating ? "Creando..." : "Crear usuario"}
        </button>
      </div>

      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.username}</td>
              <td>
                {u.firstName} {u.lastName}
              </td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.isBlocked ? "Bloqueado" : "Activo"}</td>
              <td>
                {!u.isBlocked ? (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => blockUser(u._id)}
                  >
                    Bloquear
                  </button>
                ) : (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => unlockUser(u._id)}
                  >
                    Desbloquear
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
