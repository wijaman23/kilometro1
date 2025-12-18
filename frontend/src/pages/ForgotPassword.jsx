import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      await api.post("/auth/forgot-password", { email });
      setMsg("📧 Revisa tu correo para restablecer la contraseña");
    } catch (err) {
      setError(err.response?.data?.msg || "Error enviando email");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 420 }}>
      <h3 className="mb-3">Restablecer contraseña</h3>

      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={submit}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button className="btn btn-danger w-100">
          Enviar email
        </button>
      </form>
    </div>
  );
}
