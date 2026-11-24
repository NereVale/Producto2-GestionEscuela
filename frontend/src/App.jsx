import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PanelAdmin from "./pages/PanelAdmin";
import Perfil from "./pages/Perfil";
import RutaProtegida from "./components/RutaProtegida";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<RutaProtegida rol="ADMIN"><PanelAdmin /></RutaProtegida>} />
        <Route path="/perfil" element={<RutaProtegida rol="ESTUDIANTE"><Perfil /></RutaProtegida>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}