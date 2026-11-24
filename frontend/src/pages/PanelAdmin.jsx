import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

const vacio = {
  email: "", password: "", nombre: "", carrera: "",
  grupo: "", calificacion: "", materias: "",
};

export default function PanelAdmin() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const cargar = async () => {
    try {
      setEstudiantes(await api("/estudiantes"));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const body = {
      ...form,
      materias: form.materias.split(",").map((m) => m.trim()).filter(Boolean),
    };
    try {
      if (editandoId) {
        await api(`/estudiantes/${editandoId}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await api("/estudiantes", { method: "POST", body: JSON.stringify(body) });
      }
      cancelar();
      cargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const editar = (est) => {
    setEditandoId(est.id);
    setForm({
      email: est.user.email,
      password: "",
      nombre: est.nombre,
      carrera: est.carrera,
      grupo: est.grupo,
      calificacion: est.calificacion,
      materias: est.materias.map((m) => m.nombre).join(", "),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminar = async (est) => {
       if (!window.confirm(`¿Eliminar a ${est.nombre}? Esta acción no se puede deshacer.`)) return;
        setError("");
        try {
            await api(`/estudiantes/${est.id}`, { method: "DELETE" });
            if (editandoId === est.id) cancelar();
            cargar();
        } catch (err) {
            setError(err.message);
        }
    };

  const cancelar = () => {
    setEditandoId(null);
    setForm(vacio);
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="contenedor">
      <header className="barra">
        <h1>Panel de administrador</h1>
        <button className="secundario" onClick={cerrarSesion}>Cerrar sesión</button>
      </header>

      <form className="tarjeta" onSubmit={handleSubmit}>
        <h2>{editandoId ? "Editar estudiante" : "Agregar estudiante"} {editandoId && <p><em>Editando a: {form.nombre}</em></p>}</h2>

        <div className="rejilla">
          <div>
            <label>Correo</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
                   disabled={!!editandoId} required />
          </div>
          {!editandoId && (
            <div>
              <label>Contraseña</label>
              <input name="password" type="password" value={form.password}
                     onChange={handleChange} required />
            </div>
          )}
          <div>
            <label>Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div>
            <label>Carrera</label>
            <input name="carrera" value={form.carrera} onChange={handleChange} required />
          </div>
          <div>
            <label>Grupo</label>
            <input name="grupo" value={form.grupo} onChange={handleChange} required />
          </div>
          <div>
            <label>Calificación</label>
            <input name="calificacion" type="number" step="any" min="0" value={form.calificacion} onChange={handleChange} required />
          </div>
        </div>

        <label>Materias (separadas por coma)</label>
        <input name="materias" placeholder="Matemáticas, Programación, Bases de datos"
               value={form.materias} onChange={handleChange} />

        {error && <p className="error">{error}</p>}

        <div className="acciones">
          <button type="submit">{editandoId ? "Guardar cambios" : "Agregar"}</button>
          {editandoId && (
            <button type="button" className="secundario" onClick={cancelar}>Cancelar</button>
          )}
        </div>
      </form>

      <div className="tarjeta">
        <h2>Estudiantes ({estudiantes.length})</h2>
        <div className="tabla-scroll">
          <table>
            <thead>
              <tr>
                <th>Nombre</th><th>Correo</th><th>Carrera</th><th>Grupo</th>
                <th>Calificación</th><th>Materias</th><th></th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((est) => (
                <tr key={est.id}>
                  <td>{est.nombre}</td>
                  <td>{est.user.email}</td>
                  <td>{est.carrera}</td>
                  <td>{est.grupo}</td>
                  <td>{est.calificacion}</td>
                  <td>{est.materias.map((m) => m.nombre).join(", ")}</td>
                  <td className="acciones-tabla">
                        <button type="button" onClick={() => editar(est)}>Editar</button>
                        <button type="button" className="peligro" onClick={() => eliminar(est)}>Eliminar</button>
                 </td>
                </tr>
              ))}
              {estudiantes.length === 0 && (
                <tr><td colSpan="7">Aún no hay estudiantes registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}