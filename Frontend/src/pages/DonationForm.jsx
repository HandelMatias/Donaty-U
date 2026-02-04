// src/pages/DonationForm.jsx
import { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { donationSchema } from "../validation/donationSchema.js";

const moneyToCents = (usd) => Math.round(Number(usd) * 100);

export default function DonationForm({ user, apiFetch, onCreated }) {
  const [loading, setLoading] = useState(false);

  const deliveryOptions = [
    "Facultad de Ciencias",
    "Facultad de Ciencias Administrativas",
    "Facultad de Ingeniería Civil y Ambiental (FICA)",
    "Facultad de Ingeniería Eléctrica y Electrónica",
    "Facultad de Ingeniería Mecánica",
    "Facultad de Ingeniería en Sistemas (FIS)",
    "Facultad de Ingeniería Química y Agroindustria",
    "Facultad de Geología y Petróleos",
    "Escuela de Formación de Tecnólogos (ESFOT)",
  ];

  const [form, setForm] = useState({
    tipo: "fisica", // fisica | dinero
    categoria: "",
    descripcion: "",
    // dinero
    montoUsd: "",
    moneda: "usd",
    metodoPago: "stripe", // stripe | transferencia | efectivo
    // fisica
    direccionEntrega: "",
    telefonoContacto: "",
  });

  const isDinero = useMemo(() => form.tipo === "dinero", [form.tipo]);

  useEffect(() => {
    if (user) {
      setForm((s) => ({
        ...s,
        direccionEntrega: s.direccionEntrega || user.direccion || "",
        telefonoContacto: s.telefonoContacto || user.telefono || "",
      }));
    }
  }, [user]);

  const setField = (name, value) => setForm((s) => ({ ...s, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Validación con Yup
      await donationSchema.validate(
        {
          ...form,
          montoUsd: form.montoUsd === "" ? undefined : Number(form.montoUsd),
        },
        { abortEarly: true }
      );

      setLoading(true);

      // Chequeo opcional de similitud (para evitar duplicados)
      const desc = (form.descripcion || "").trim();
      if (desc.length >= 3) {
        // Umbral dinámico: textos cortos requieren score más alto
        const threshold = desc.length <= 5 ? 0.95 : desc.length <= 15 ? 0.85 : 0.8;
        try {
          const sim = await apiFetch("/ai/index", {
            method: "POST",
            body: { text: desc, topK: 3, minScore: threshold },
          });
          const similares = (sim?.matches || []).filter(
            (m) => Number(m.score || 0) >= threshold
          );
          if (similares.length) {
            const listado = similares
              .map((m) => `• ${m.text} (score ${Number(m.score).toFixed(2)})`)
              .join("\n");
            toast.error(
              `Se encontraron donaciones muy similares:\n${listado}\n\nAjusta la descripción antes de continuar.`,
              { autoClose: 5000 }
            );
            setLoading(false);
            return; // bloquear creación
          }
        } catch (err) {
          console.warn("Similitud no disponible:", err?.message || err);
          toast.info("Servicio de similitud no disponible; continuando.", {
            autoClose: 2500,
          });
          // No bloqueamos el flujo si falla la IA
        }
      }

      const payload = {
        tipo: form.tipo,
        categoria: (form.categoria || "").trim(),
        descripcion: (form.descripcion || "").trim(),
        moneda: (form.moneda || "usd").toLowerCase(),
      };

      if (isDinero) {
        payload.monto = moneyToCents(form.montoUsd); // centavos
        payload.metodoPago = (form.metodoPago || "stripe").toLowerCase();
      } else {
        payload.metodoPago = "ninguno";
        payload.direccionEntrega = (form.direccionEntrega || "").trim();
        payload.telefonoContacto = (form.telefonoContacto || "").trim();
      }

      // ✅ SOLO ESTA LÍNEA CAMBIÓ (antes: "/api/donaciones")
      const res = await apiFetch("/donacion", {
        method: "POST",
        body: payload,
      });

      toast.success("¡Donación registrada exitosamente!", {
        position: "top-right",
        autoClose: 3500,
        theme: "colored",
        icon: "✅",
      });

      // Stripe: redirige a checkout
      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
        return;
      }

      onCreated?.();

      // limpiar sin borrar autocompletado
      setForm((s) => ({
        ...s,
        categoria: "",
        descripcion: "",
        montoUsd: "",
      }));
    } catch (err) {
      // ✅ muestra mensaje real del backend si existe
      toast.error(err?.message || "Error al procesar la donación.");
      console.error("DonationForm submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white shadow-xl p-6 rounded-xl">
        <p className="text-gray-700">
          Debes iniciar sesión para registrar una donación.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-xl p-8 rounded-xl">
      {/* Header */}
      <ToastContainer
        position="top-right"
        autoClose={3500}
        newestOnTop
        theme="colored"
        pauseOnHover={false}
      />

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Registrar Donación
        </h3>
        <p className="text-sm text-gray-600">
          Completa el formulario. Puedes registrar donación física o monetaria.
        </p>
      </div>

      {/* Tabs (mismo estilo del sidebar) */}
      <div className="mb-6 flex gap-3">
        <button
          type="button"
          onClick={() => setField("tipo", "fisica")}
          className={[
            "px-4 py-2 rounded-lg font-medium transition",
            form.tipo === "fisica"
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100",
          ].join(" ")}
        >
          Donación Física
        </button>

        <button
          type="button"
          onClick={() => setField("tipo", "dinero")}
          className={[
            "px-4 py-2 rounded-lg font-medium transition",
            form.tipo === "dinero"
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100",
          ].join(" ")}
        >
          Donación Monetaria
        </button>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Categoría
          </label>
          <input
            value={form.categoria}
            onChange={(e) => setField("categoria", e.target.value)}
            placeholder="Ej: Ropa, Comida, Juguetes..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            Opcional, pero recomendado.
          </p>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Descripción
          </label>
          <textarea
            value={form.descripcion}
            onChange={(e) => setField("descripcion", e.target.value)}
            placeholder="Describe la donación (cantidad, estado, detalles)."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
        </div>

        {/* Dinero */}
        {isDinero && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Monto (USD)
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.montoUsd}
                  onChange={(e) => setField("montoUsd", e.target.value)}
                  placeholder="Ej: 5.00"
                  className="w-full outline-none"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Se enviará al backend en centavos.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Método de pago
              </label>
              <select
                value={form.metodoPago}
                onChange={(e) => setField("metodoPago", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="stripe">Stripe</option>
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
              </select>

              <div className="mt-2 rounded-lg bg-blue-50 border border-blue-100 p-3">
                <p className="text-sm text-blue-800">
                  Si eliges <b>Stripe</b>, te redirigiremos al checkout para
                  completar el pago.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Física */}
        {!isDinero && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Dirección de entrega
              </label>
              <select
                value={form.direccionEntrega}
                onChange={(e) => setField("direccionEntrega", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                required
              >
                <option value="">Selecciona un punto</option>
                {deliveryOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Teléfono de contacto
              </label>
              <input
                value={form.telefonoContacto}
                onChange={(e) => setField("telefonoContacto", e.target.value)}
                placeholder="Ej: 09xxxxxxxx"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="md:col-span-2 rounded-lg bg-gray-50 border border-gray-200 p-4">
              <p className="text-sm text-gray-700">
                <b>Nota:</b> Para donaciones físicas se requiere dirección y
                teléfono.
              </p>
            </div>
          </div>
        )}

        {/* Actions (coherente con botones del dashboard) */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end pt-2">
          <button
            type="button"
            onClick={() =>
              setForm((s) => ({
                ...s,
                categoria: "",
                descripcion: "",
                montoUsd: "",
              }))
            }
            className="w-full sm:w-auto bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
            disabled={loading}
          >
            Limpiar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading
              ? "Procesando..."
              : isDinero
              ? "Continuar"
              : "Enviar Donación"}
          </button>
        </div>
      </form>
    </div>
  );
}
