// src/pages/PaymentSuccess.jsx
import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [status, setStatus] = useState("confirmando...");
  const [error, setError] = useState("");

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) {
      setStatus("Sin session_id recibido");
      return;
    }

    const confirm = async () => {
      try {
        const base =
          (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api").replace(
            /\/$/,
            ""
          );
        const resp = await fetch(`${base}/stripe/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) throw new Error(data?.msg || "No se pudo confirmar el pago");
        setStatus(data.status || "pagado");
      } catch (e) {
        setError(e.message);
      }
    };

    confirm();
  }, [params]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D3E5FF] px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-3">
          ¡Pago completado!
        </h1>
        <p className="text-gray-700 mb-3">
          Gracias por tu donación. Estado: <b>{status}</b>
        </p>
        {error && (
          <p className="text-red-600 text-sm mb-3">
            No se pudo confirmar automáticamente: {error}
          </p>
        )}
        <NavLink
          to="/donante"
          className="inline-flex justify-center px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Volver al panel
        </NavLink>
      </div>
    </div>
  );
}
