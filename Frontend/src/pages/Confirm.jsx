import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import Logo from "/src/assets/LogoDEc.png";

const Confirm = () => {
  const { token } = useParams();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/confirmar/${token}`; // 👈 AQUÍ EL CAMBIO

        const response = await fetch(url);
        const data = await response.json();

        console.log("Respuesta confirmación:", data);
      } catch (error) {
        console.error("Error confirmando usuario:", error);
      }
    };

    if (token) verifyToken();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <img
        src={Logo}
        alt="Logo"
        className="w-48 h-48 object-contain rounded-full shadow-xl border-4 border-blue-300"
      />

      <div className="text-center mt-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          ¡Cuenta Confirmada!
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Tu correo ha sido verificado correctamente.
          <br />
          Ya puedes iniciar sesión.
        </p>
      </div>

      <Link
        to="/login"
        className="mt-8 px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-medium shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300"
      >
        Iniciar Sesión
      </Link>
    </div>
  );
};

export default Confirm;
