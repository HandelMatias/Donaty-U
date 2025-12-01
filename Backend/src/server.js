// src/server.js
import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import "dotenv/config";

import router from "./routers/index.js";
import {
  confirmarMail,
  comprobarTokenPasword,
} from "./controllers/donante_controller.js";

const app = express();

// ====== MIDDLEWARES BÁSICOS ======

// Permitir JSON en req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS MUY SIMPLE (como el ejemplo de tesis)
app.use(cors());

// (Opcional) si usas subida de archivos en otro lado del proyecto:
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp",
  })
);

// ====== RUTAS ======

// Health check (para probar rápido que el backend vive)
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "donaty-api" });
});

// Rutas directas para confirmar y recuperar
app.get("/confirmar/:token", confirmarMail);
app.get("/recuperarpassword/:token", comprobarTokenPasword);
app.get("/donante/confirmar/:token", confirmarMail);
app.get("/donante/recuperarpassword/:token", comprobarTokenPasword);

// Rutas principales de la API (prefijo /api)
app.use("/api", router);

// Ruta no encontrada
app.use((_req, res) => {
  res.status(404).send("Endpoint no encontrado - 404");
});

export default app;
