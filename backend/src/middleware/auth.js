import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token requerido" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // { id, role }
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export const soloAdmin = (req, res, next) =>
  req.user.role === "ADMIN"
    ? next()
    : res.status(403).json({ error: "Acceso solo para administradores" });