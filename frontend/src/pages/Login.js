import { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import foto from "../assets/foto.png";
import firma from "../assets/firma.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });
      login(res.data.token);
      navigate("/dashboard");
    } catch {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="container-fluid vh-100 bg-dark text-white position-relative overflow-hidden">

      {/* FOTO CHICO - SEGUNDO PLANO */}
      <img
        src={foto}
        alt="Coach"
        style={{
          position: "absolute",
          left: "-5%",
          bottom: "0",
          height: "90%",
          opacity: 0.18,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* FIRMA */}
      <img
        src={firma}
        alt="Firma"
        style={{
          position: "absolute",
          right: "40px",
          bottom: "30px",
          width: "140px",
          opacity: 0.8,
          zIndex: 3,
        }}
      />

      {/* CONTENIDO CENTRAL */}
      <div
        className="h-100 d-flex flex-column justify-content-center align-items-center position-relative"
        style={{ zIndex: 2 }}
      >

        {/* 🔥 TITULO FUERA DEL LOGIN */}
        <h1
          style={{
            fontSize: "3.2rem",
            fontWeight: 800,
            letterSpacing: "2px",
            marginBottom: "5px",
          }}
        >
          KILÓMETRO 1
        </h1>

        <p
          className="text-secondary mb-4"
          style={{ fontSize: "1rem" }}
        >
          Entrena · Corre · Supera tus límites
        </p>

        {/* LOGIN CARD */}
        <div
          className="card bg-dark border-0 shadow-lg p-4"
          style={{ width: "380px" }}
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                className="form-control bg-secondary bg-opacity-25 border-0 text-white"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control bg-secondary bg-opacity-25 border-0 text-white"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="alert alert-danger py-2">
                {error}
              </div>
            )}

            <button className="btn btn-danger w-100 fw-semibold">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
