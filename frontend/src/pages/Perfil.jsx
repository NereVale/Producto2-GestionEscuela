import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Perfil() {
  const [est, setEst] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api("/estudiantes/me").then(setEst).catch((err) => setError(err.message));
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="contenedor">
      <header className="barra">
        <h1>Mi información</h1>
        <button className="secundario" onClick={cerrarSesion}>Cerrar sesión</button>
      </header>

      {error && <p className="error">{error}</p>}

      {est && (
        <div className="tarjeta">
          <p><strong>Nombre:</strong> {est.nombre}</p>
          <p><strong>Carrera:</strong> {est.carrera}</p>
          <p><strong>Grupo:</strong> {est.grupo}</p>
          <p><strong>Calificación:</strong> {est.calificacion}</p>
          <p><strong>Materias:</strong></p>
          <ul>
            {est.materias.map((m) => <li key={m.id}>{m.nombre}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}