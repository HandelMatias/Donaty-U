// src/routers/donante_routes.js
import { Router } from "express";
import {
  registro,
  confirmarMail,
  recuperarPassword,
  comprobarTokenPasword,
  crearNuevoPassword,
  login,
  perfil,
  actualizarPerfil,
  actualizarPassword
} from "../controllers/donante_controller.js";
import auth from "../middlewares/JWT.js";

const router = Router();

router.post("/registro", registro);
router.get("/confirmar/:token", confirmarMail);

router.post("/recuperarpassword", recuperarPassword);
router.get("/recuperarpassword/:token", comprobarTokenPasword);
router.post("/nuevopassword/:token", crearNuevoPassword);

router.post("/donante/login", login); // queda /api/donante/donante/login si tu prefijo es /api/donante

router.get("/perfil", auth, perfil);
router.put("/actualizarperfil/:id", auth, actualizarPerfil);
// si insistes en usar id en la URL: router.put("/actualizarpassword/:id", auth, actualizarPassword);
router.put("/actualizarpassword/:id", auth, actualizarPassword);

export default router;
