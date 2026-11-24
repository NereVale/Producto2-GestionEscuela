import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

await prisma.user.upsert({
  where: { email: "admin@escuela.com" },
  update: {},
  create: {
    email: "admin@escuela.com",
    password: await bcrypt.hash("Admin123*", 10),
    role: "ADMIN",
  },
});
console.log("Admin creado");