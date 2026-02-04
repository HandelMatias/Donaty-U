// src/pages/GoogleCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const rol = params.get("rol") || "donante";
    const msg = params.get("msg");

    if (msg && !token) {
      toast.error(msg, { autoClose: 4000 });
      return;
    }

    if (!token) {
      toast.error("No se recibió el token de Google.", { autoClose: 4000 });
      return;
    }

    // guarda token según rol
    const tokenKey =
      rol === "admin"
        ? "donatyAdminToken"
        : rol === "recolector"
        ? "donatyRecolectorToken"
        : "donatyToken";
    localStorage.setItem(tokenKey, token);
    localStorage.setItem("donatyRole", rol);

    toast.success("Inicio de sesión con Google exitoso.", {
      position: "top-right",
      autoClose: 1800,
    });

    setTimeout(() => {
      if (rol === "admin") navigate("/admin", { replace: true });
      else if (rol === "recolector") navigate("/recolector", { replace: true });
      else navigate("/donante", { replace: true });
    }, 1200);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#D3E5FF]">
      <ToastContainer />
      <div className="bg-white shadow-xl rounded-xl p-8 text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Conectando con Google…
        </h1>
        <p className="text-gray-600">Espera un momento mientras procesamos tu inicio de sesión.</p>
        <div className="mt-6 flex justify-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;
