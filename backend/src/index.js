import "dotenv/config";
import express from "express";
import cors from "cors";
import auth from "./routes/auth.js";
import estudiantes from "./routes/estudiantes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/estudiantes", estudiantes);
app.listen(process.env.PORT, () => console.log("API en puerto", process.env.PORT));