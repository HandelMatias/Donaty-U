import mongoose from "mongoose";
import Donacion from "../models/Donacion.js";
import { isBlank } from "../utils/validation.js";
import { createStripeCheckoutSession } from "./stripe_controller.js";

const TIPOS = ["dinero", "fisica"];
const ESTADOS = [
  "pendiente",
  "pagado",
  "asignada",
  "entregada",
  "cancelada",
];

const normalizeTipo = (value = "") => {
  const raw = String(value).trim().toLowerCase();
  if (raw === "fisico" || raw === "física") return "fisica";
  return raw;
};

const normalizeEstado = (value = "") => String(value).trim().toLowerCase();

const crearDonacion = async (req, res) => {
  try {
    const user = req.user || req.donanteHeader;
    if (!user) return res.status(401).json({ msg: "No autenticado" });

    const {
      tipo,
      categoria,
      descripcion,
      monto,
      moneda,
      metodoPago,
      direccionEntrega,
      telefonoContacto,
      metadata,
    } = req.body || {};

    if (isBlank(tipo)) {
      return res.status(400).json({ msg: "Debes indicar el tipo de donación" });
    }

    const tipoFinal = normalizeTipo(tipo);
    if (!TIPOS.includes(tipoFinal)) {
      return res.status(400).json({ msg: "Tipo de donación inválido" });
    }

    const isDinero = tipoFinal === "dinero";
    const estadoInicial = "pendiente";
    const metodoFinal = isDinero
      ? String(metodoPago || "stripe").trim().toLowerCase()
      : "ninguno";

    if (isDinero) {
      const amountInt = Number(monto);
      if (!Number.isInteger(amountInt) || amountInt <= 0) {
        return res.status(400).json({
          msg: "Monto inválido. Envía 'monto' en centavos (entero).",
        });
      }
      const metodoValido = [
        "stripe",
        "efectivo",
        "transferencia",
        "ninguno",
      ].includes(
        metodoFinal
      );
      if (!metodoValido) {
        return res.status(400).json({ msg: "Método de pago inválido" });
      }
    } else {
      const hasDetalle = !isBlank(descripcion) || !isBlank(categoria);
      if (!hasDetalle) {
        return res
          .status(400)
          .json({ msg: "Debes indicar la descripción o categoría" });
      }
    }

    const direccionFinal = String(
      direccionEntrega ?? user.direccion ?? ""
    ).trim();
    const telefonoFinal = String(
      telefonoContacto ?? user.telefono ?? ""
    ).trim();

    if (!isDinero && (isBlank(direccionFinal) || isBlank(telefonoFinal))) {
      return res.status(400).json({
        msg: "Debes indicar dirección y teléfono para donaciones físicas",
      });
    }

    const donacion = new Donacion({
      donante: user._id,
      tipo: tipoFinal,
      categoria: categoria ?? "",
      descripcion: descripcion ?? "",
      monto: isDinero ? Number(monto) : null,
      moneda: String(moneda || "usd").toLowerCase(),
      metodoPago: metodoFinal,
      estado: estadoInicial,
      direccionEntrega: direccionFinal,
      telefonoContacto: telefonoFinal,
      metadata: metadata && typeof metadata === "object" ? metadata : {},
    });

    await donacion.save();

    if (isDinero && metodoFinal === "stripe") {
      try {
        const session = await createStripeCheckoutSession({
          amount: donacion.monto,
          currency: donacion.moneda,
          description: descripcion || "Donación",
          metadata: {
            ...(donacion.metadata || {}),
            donacionId: String(donacion._id),
            donanteId: String(user._id),
            tipo: "dinero",
          },
          email: user.email,
        });

        donacion.stripeSessionId = session.id;
        if (session.payment_intent) {
          donacion.stripePaymentIntentId = session.payment_intent;
        }
        await donacion.save();

        return res.status(201).json({
          donacion,
          checkoutUrl: session.url,
          sessionId: session.id,
        });
      } catch (error) {
        await Donacion.findByIdAndDelete(donacion._id);
        return res
          .status(500)
          .json({ msg: error.message || "Error creando sesión Stripe" });
      }
    }

    return res.status(201).json({ donacion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
  }
};

const listarMisDonaciones = async (req, res) => {
  try {
    const user = req.user || req.donanteHeader;
    if (!user) return res.status(401).json({ msg: "No autenticado" });

    const items = await Donacion.find({ donante: user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
  }
};

const listarDonaciones = async (req, res) => {
  try {
    const { tipo, estado, donanteId, recolectorId } = req.query || {};
    const filtro = {};

    if (tipo) {
      const tipoFinal = normalizeTipo(tipo);
      if (!TIPOS.includes(tipoFinal)) {
        return res.status(400).json({ msg: "Tipo inválido" });
      }
      filtro.tipo = tipoFinal;
    }

    if (estado) {
      const estadoFinal = normalizeEstado(estado);
      if (!ESTADOS.includes(estadoFinal)) {
        return res.status(400).json({ msg: "Estado inválido" });
      }
      filtro.estado = estadoFinal;
    }

    if (donanteId && mongoose.Types.ObjectId.isValid(donanteId)) {
      filtro.donante = donanteId;
    }

    if (recolectorId && mongoose.Types.ObjectId.isValid(recolectorId)) {
      filtro.recolector = recolectorId;
    }

    const items = await Donacion.find(filtro)
      .sort({ createdAt: -1 })
      .populate("donante", "nombre apellido email telefono")
      .populate("recolector", "nombre apellido email telefono");

    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
  }
};

const listarPendientesRecolector = async (req, res) => {
  try {
    const items = await Donacion.find({
      tipo: "fisica",
      estado: "pendiente",
      recolector: null,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
  }
};

const listarAsignadasRecolector = async (req, res) => {
  try {
    const user = req.user || req.donanteHeader;
    if (!user) return res.status(401).json({ msg: "No autenticado" });

    const items = await Donacion.find({
      recolector: user._id,
    }).sort({ createdAt: -1 });
    return res.status(200).json({ items });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
  }
};

const asignarRecolector = async (req, res) => {
  try {
    const user = req.user || req.donanteHeader;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: `ID inválido: ${id}` });
    }

    const donacion = await Donacion.findById(id);
    if (!donacion) {
      return res.status(404).json({ msg: "Donación no encontrada" });
    }
    if (donacion.tipo !== "fisica") {
      return res
        .status(400)
        .json({ msg: "Solo aplica para donaciones físicas" });
    }
    if (donacion.estado !== "pendiente") {
      return res.status(400).json({
        msg: "La donación no está disponible para asignación",
      });
    }

    donacion.recolector = user._id;
    donacion.estado = "asignada";
    await donacion.save();

    return res.status(200).json(donacion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
  }
};

const marcarEntregada = async (req, res) => {
  try {
    const user = req.user || req.donanteHeader;
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: `ID inválido: ${id}` });
    }

    const donacion = await Donacion.findById(id);
    if (!donacion) {
      return res.status(404).json({ msg: "Donación no encontrada" });
    }
    if (donacion.tipo !== "fisica") {
      return res
        .status(400)
        .json({ msg: "Solo aplica para donaciones físicas" });
    }
    if (!donacion.recolector || String(donacion.recolector) !== String(user._id)) {
      return res.status(403).json({ msg: "No autorizado" });
    }
    if (donacion.estado !== "asignada") {
      return res
        .status(400)
        .json({ msg: "La donación no está asignada" });
    }

    donacion.estado = "entregada";
    await donacion.save();

    return res.status(200).json(donacion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
  }
};

const actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: `ID inválido: ${id}` });
    }
    if (isBlank(estado)) {
      return res.status(400).json({ msg: "Debes indicar el estado" });
    }

    const estadoFinal = normalizeEstado(estado);
    if (!ESTADOS.includes(estadoFinal)) {
      return res.status(400).json({ msg: "Estado inválido" });
    }

    const donacion = await Donacion.findById(id);
    if (!donacion) {
      return res.status(404).json({ msg: "Donación no encontrada" });
    }

    donacion.estado = estadoFinal;
    await donacion.save();

    return res.status(200).json(donacion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: `❌ Error en el servidor - ${error}` });
  }
};

export {
  crearDonacion,
  listarMisDonaciones,
  listarDonaciones,
  listarPendientesRecolector,
  listarAsignadasRecolector,
  asignarRecolector,
  marcarEntregada,
  actualizarEstado,
};
