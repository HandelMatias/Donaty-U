import { Router } from "express";
import auth from "../middlewares/JWT.js";
import requireRole from "../middlewares/requireRole.js";
import requirePerfilCompleto from "../middlewares/requirePerfilCompleto.js";
import {
  crearDonacion,
  listarMisDonaciones,
  listarDonaciones,
  listarPendientesRecolector,
  listarAsignadasRecolector,
  asignarRecolector,
  marcarEntregada,
  actualizarEstado,
} from "../controllers/donacion_controller.js";

const router = Router();

router.use(auth);

// Donante
router.post("/", requireRole("donante"), requirePerfilCompleto, crearDonacion);
router.get("/mis", requireRole("donante"), listarMisDonaciones);

// Admin
router.get("/", requireRole("admin"), listarDonaciones);
router.patch("/:id/estado", requireRole("admin"), actualizarEstado);

// Recolector
router.get("/pendientes", requireRole("recolector"), listarPendientesRecolector);
router.get("/asignadas", requireRole("recolector"), listarAsignadasRecolector);
router.patch("/:id/asignar", requireRole("recolector"), asignarRecolector);
router.patch("/:id/entregar", requireRole("recolector"), marcarEntregada);

export default router;
