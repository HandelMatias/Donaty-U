// src/pages/Forgot.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Inicio from "../assets/DEc.png";

const Forgot = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);

  const sendMail = async ({ email }) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword`;
    console.log("URL recuperar password:", url);

    try {
      setLoading(true);

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg =
          data?.msg ||
          "No se pudo procesar la solicitud. Verifica el correo ingresado.";
        throw new Error(msg);
      }

      toast.success(
        data?.msg ||
          "Hemos enviado un correo con instrucciones para restablecer tu contraseña.",
        { position: "top-right", autoClose: 4000 }
      );

      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Error al enviar el correo.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-blue-50">
      <ToastContainer />

      {/* Columna izquierda: formulario */}
      <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">
        <div className="md:w-4/5 sm:w-full px-4">
          <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-slate-700">
            ¿Olvidaste tu contraseña?
          </h1>
          <small className="text-gray-500 block my-4 text-sm text-center">
            No te preocupes, te ayudaremos a recuperarla.
          </small>

          {/* Formulario */}
          <form onSubmit={handleSubmit(sendMail)}>
            {/* Email */}
            <div className="mb-1">
              <label className="mb-2 block text-sm font-semibold">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="Ingresa un correo electrónico válido"
                className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email", {
                  required: "El correo electrónico es obligatorio",
                })}
              />
              {errors.email && (
                <p className="text-red-700 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Botón */}
            <div className="mb-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-slate-100 border py-2 w-full rounded-xl mt-5 
                           hover:scale-105 duration-300 hover:bg-blue-700 disabled:bg-blue-300"
              >
                {loading ? "Enviando..." : "Enviar correo"}
              </button>
            </div>
          </form>

          <div className="mt-5 text-xs border-b-2 border-gray-200 py-4" />

          {/* Enlace login */}
          <div className="mt-3 text-sm flex justify-between items-center">
            <p>¿Ya tienes una cuenta?</p>
            <Link
              to="/login"
              className="py-2 px-5 bg-gray-700 text-slate-100 border rounded-xl 
                         hover:scale-110 duration-300 hover:bg-black"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Columna derecha: imagen Donaty desde assets */}
      <div className="w-full sm:w-1/2 h-1/3 sm:h-screen hidden sm:block">
        <img
          src={Inicio}
          alt="Imagen Donaty"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Forgot;
