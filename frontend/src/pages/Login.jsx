import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { token, role } = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      navigate(role === "ADMIN" ? "/admin" : "/perfil");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="centro">
      <form className="tarjeta" onSubmit={handleSubmit}>
        <h1>Control de Estudiantes</h1>
        <label>Correo</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="ancho">Iniciar sesión</button>
      </form>
    </div>
  );
}