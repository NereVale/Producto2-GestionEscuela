import { Navigate } from "react-router-dom";

export default function RutaProtegida({ rol, children }) {
  const role = localStorage.getItem("role");
  if (!role || role !== rol) return <Navigate to="/login" />;
  return children;
}