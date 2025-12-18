import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post(`auth/reset-password/${token}`, { password });
      setOk(true);

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Error al cambiar contraseña");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "420px" }}>
      <h3>Restablecer contraseña</h3>

      {ok && (
        <div className="alert alert-success">
          Contraseña cambiada. Redirigiendo...
        </div>
      )}

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

        <button className="btn btn-primary w-100">
          Guardar contraseña
        </button>
      </form>
    </div>
  );
}
