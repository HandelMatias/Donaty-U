import jwt from "jsonwebtoken";
import Donante from "../models/Donante.js";

const JWT_SECRET = process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

export const crearTokenJWT = (id, rol = "donante") => {
  return jwt.sign({ id, rol }, JWT_SECRET, { expiresIn: "4h" });
};

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.replace("Bearer ", "") : null;

    if (!token) {
      return res.status(401).json({ msg: "Token requerido" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const donante = await Donante.findById(decoded.id);
    if (!donante) {
      return res.status(401).json({ msg: "Usuario no autorizado" });
    }

    req.donanteHeader = donante;
    return next();
  } catch (error) {
    console.error("authMiddleware error", error.message);
    return res.status(401).json({ msg: "Token inválido" });
  }
};

export default authMiddleware;
