import { Router } from "express";
import { createCheckoutSession } from "../controllers/stripe_controller.js";

const router = Router();

router.post("/checkout", createCheckoutSession);

export default router;
