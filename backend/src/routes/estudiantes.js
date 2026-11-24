import { Router } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { verificarToken, soloAdmin } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = Router();
router.use(verificarToken);

// ESTUDIANTE: solo ve SU información
router.get("/me", async (req, res) => {
  const est = await prisma.estudiante.findUnique({
    where: { userId: req.user.id },
    include: { materias: true },
  });
  if (!est) return res.status(404).json({ error: "Perfil no encontrado" });
  res.json(est);
});

// ADMIN: listar todos
router.get("/", soloAdmin, async (req, res) => {
  res.json(await prisma.estudiante.findMany({ include: { materias: true, user: { select: { email: true } } } }));
});

// ADMIN: crear estudiante (crea usuario + perfil)
router.post("/", soloAdmin, async (req, res) => {
  const { email, password, nombre, carrera, grupo, calificacion, materias = [] } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        role: "ESTUDIANTE",
        estudiante: {
          create: {
            nombre, carrera, grupo, calificacion: Number(calificacion),
            materias: { create: materias.map((m) => ({ nombre: m })) },
          },
        },
      },
      include: { estudiante: { include: { materias: true } } },
    });
    res.status(201).json(user.estudiante);
  } catch (e) {
    res.status(400).json({ error: "No se pudo crear (¿correo repetido?)" });
  }
});

// ADMIN: editar estudiante
router.put("/:id", soloAdmin, async (req, res) => {
  try {
    const { nombre, carrera, grupo, calificacion, materias } = req.body;
    const id = Number(req.params.id);
    const est = await prisma.estudiante.update({
      where: { id },
      data: {
        nombre, carrera, grupo, calificacion: Number(calificacion),
        ...(materias && {
          materias: { deleteMany: {}, create: materias.map((m) => ({ nombre: m })) },
        }),
      },
      include: { materias: true },
    });
    res.json(est);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "No se pudo actualizar el estudiante" });
  }
});

// ADMIN: eliminar estudiante (borra también su usuario y sus materias)
router.delete("/:id", soloAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const est = await prisma.estudiante.findUnique({ where: { id } });
    if (!est) return res.status(404).json({ error: "Estudiante no encontrado" });

    // Al borrar el usuario, el onDelete: Cascade elimina su perfil y sus materias
    await prisma.user.delete({ where: { id: est.userId } });
    res.json({ mensaje: "Estudiante eliminado" });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: "No se pudo eliminar el estudiante" });
  }
});
export default router;