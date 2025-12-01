// src/pages/Login.jsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Inicio from "../assets/DEc.png";
import Facebook from "../assets/facebook.png";
import Whats from "../assets/whatsapp.png";
import Insta from "../assets/instagram.png";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 🔹 función para consumir endpoint de login
  const loginUser = async (dataForm) => {
    const { email, password } = dataForm;

    const url = `${import.meta.env.VITE_BACKEND_URL}/login`; 
    // VITE_BACKEND_URL = http://localhost:4000/api/donante

    console.log("Intentando login en:", url);
    try {
      setLoading(true);

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg = data?.msg || "Error al iniciar sesión.";
        throw new Error(msg);
      }

      // ✅ Guardamos token y datos básicos en localStorage
      if (data.token) {
        localStorage.setItem("donatyToken", data.token);
      }
      localStorage.setItem("donatyUser", JSON.stringify(data));

      toast.success("Inicio de sesión exitoso.", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/donante");
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo iniciar sesión.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#D3E5FF]">
      <ToastContainer />

      {/* Main content */}
      <main className="flex flex-col md:flex-row flex-grow">
        {/* Imagen izquierda */}
        <div className="hidden md:flex w-1/2 bg-gray-200 items-center justify-center">
          <img
            src={Inicio}
            alt="Imagen izquierda"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Formulario derecha */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-6 py-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Inicio de Sesión
          </h2>

          <form
            onSubmit={handleSubmit(loginUser)}
            className="w-full max-w-xl bg-white shadow-2xl shadow-black/50 rounded-xl p-11"
          >
            <h3 className="text-xl font-semibold mb-4">Ingresa tus datos</h3>

            {/* Email */}
            <div className="mb-4">
              <label className="block font-medium mb-1">E-mail</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu Email"
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

            {/* Contraseña */}
            <div className="mb-2">
              <label className="block font-medium mb-1">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu contraseña"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
              />
              {errors.password && (
                <p className="text-red-700 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Mostrar contraseña + Olvidaste tu contraseña */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  id="showPass"
                  className="cursor-pointer"
                  onChange={() => setShowPassword((prev) => !prev)}
                />
                <label htmlFor="showPass" className="cursor-pointer">
                  Mostrar contraseña
                </label>
              </div>

              <NavLink
                to="/forgot"
                className="text-sm text-blue-600 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </NavLink>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition disabled:bg-blue-300"
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Enlace registro */}
          <p className="mt-6 text-gray-700 text-center">
            ¿No tienes cuenta?
            <NavLink
              to="/register"
              className="text-blue-600 font-semibold ml-1 hover:underline"
            >
              Regístrate aquí
            </NavLink>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#170404] text-white py-6 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Políticas */}
          <nav className="flex gap-2">
            <NavLink to="/politicsterms" className="text-pink-200 hover:underline">
              Políticas de Privacidad
            </NavLink>
            |
            <NavLink to="/politicsterms" className="text-pink-200 hover:underline">
              Términos de Uso
            </NavLink>
          </nav>

          {/* Derechos */}
          <p>© DONATY-EC. Todos los derechos reservados.</p>

          {/* Iconos sociales */}
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61570160151308"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={Facebook}
                alt="Facebook"
                className="w-8 h-8 hover:scale-110 transition-transform"
              />
            </a>
            <a href="https://wa.me/983203628" target="_blank" rel="noreferrer">
              <img
                src={Whats}
                alt="WhatsApp"
                className="w-8 h-8 hover:scale-110 transition-transform"
              />
            </a>
            <a
              href="https://www.instagram.com/donatyecuador/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={Insta}
                alt="Instagram"
                className="w-8 h-8 hover:scale-110 transition-transform"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
