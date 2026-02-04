// src/pages/PaymentCancel.jsx
import { NavLink } from "react-router-dom";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D3E5FF] px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-3">
          Pago cancelado
        </h1>
        <p className="text-gray-700 mb-6">
          No se completó el cobro. Puedes intentar nuevamente o elegir otro método.
        </p>
        <div className="flex gap-3 justify-center">
          <NavLink
            to="/donante"
            className="px-5 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Volver al panel
          </NavLink>
        </div>
      </div>
    </div>
  );
}
