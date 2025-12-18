import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("mustChangeUserId");

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  // 🔐 Si no viene del login, fuera
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/change-password", {
        userId,
        password,
      });

      localStorage.removeItem("mustChangeUserId");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Error al cambiar contraseña");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <h3 className="mb-3 text-center">Cambiar contraseña</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={submit}>
        <div className="input-group mb-3">
          <input
            type={show ? "text" : "password"}
            className="form-control"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShow(!show)}
          >
            {show ? "🙈" : "👁️"}
          </button>
        </div>

        <small className="text-muted">
          Mínimo 5 caracteres
        </small>

        <button className="btn btn-danger w-100 mt-3">
          Guardar contraseña
        </button>
      </form>
    </div>
  );
}
