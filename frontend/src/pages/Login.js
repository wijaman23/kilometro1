import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { username, password });

      // Si tu backend devuelve { token: "..." } esto es correcto
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");

      const jwt = res.data?.token;

      if (!jwt) {
        setError("No se recibió token del servidor");
        return;
      }

      // ✅ IMPORTANTÍSIMO: persistir token (lo hace AuthContext)
      setToken(jwt);

      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Caso "mustChangePassword"
      if (err.response?.status === 403 && err.response.data?.mustChangePassword) {
        localStorage.setItem("mustChangeUserId", err.response.data.userId);
        navigate("/change-password", { replace: true });
        return;
      }

      setError(err.response?.data?.msg || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-wrapper">
      {/* LADO IZQUIERDO – IMAGEN */}
      <div className="login-image">
        <div className="overlay" />
      </div>

      {/* LADO DERECHO – FORM */}
      <div className="login-form">
        <div className="card shadow p-4 login-card">
          <h2 className="login-title text-center mb-4">Kilometro 1</h2>

          {error && (
            <div className="alert alert-danger text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="input-group mb-3">
              <input
                type={show ? "text" : "password"}
                className="form-control"
                placeholder="Contraseña"
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

            <button className="btn btn-danger w-100 mb-3">Entrar</button>
          </form>

          <div className="text-center">
            <Link to="/forgot-password">¿Has olvidado tu contraseña?</Link>
          </div>
        </div>
      </div>

      <img
        src={require("../assets/firma.png")}
        alt="Firma"
        className="login-signature"
      />
    </div>
  );
}
