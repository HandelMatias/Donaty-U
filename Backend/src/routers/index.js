import { Router } from "express";
import donanteRoutes from "./donante_routes.js";

const router = Router();

// Prefijo principal: /api/donante/...
router.use("/donante", donanteRoutes);

// Aliases de compatibilidad (mantiene lo que había antes mientras migras)
router.use("/", donanteRoutes);
router.use("/auth", donanteRoutes);

export default router;
