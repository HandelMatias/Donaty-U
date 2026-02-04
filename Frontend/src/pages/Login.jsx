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
  const [role, setRole] = useState("donante"); // donante | admin | recolector

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 🔹 función para consumir endpoint de login
  const loginUser = async (dataForm) => {
    const { email, password } = dataForm;

    const base = (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api").replace(/\/$/, "");
    const path =
      role === "admin"
        ? "/admin/login"
        : role === "recolector"
        ? "/recolector/login"
        : "/donante/login";
    const url = `${base}${path}`;

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
        const tokenKey =
          role === "admin"
            ? "donatyAdminToken"
            : role === "recolector"
            ? "donatyRecolectorToken"
            : "donatyToken";
        localStorage.setItem(tokenKey, data.token);
      }
      localStorage.setItem("donatyUser", JSON.stringify({ ...data, role }));
      localStorage.setItem("donatyRole", role);

      toast.success("Inicio de sesión exitoso.", {
        position: "top-right",
        autoClose: 2000,
      });

      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else if (role === "recolector") navigate("/recolector");
        else navigate("/donante");
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

  const loginWithGoogle = () => {
    const base =
      (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api").replace(
        /\/$/,
        ""
      );
    window.location.href = `${base}/donante/google`;
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

            {/* Rol */}
            <div className="mb-6">
              <label className="block font-medium mb-2">Rol</label>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { value: "donante", label: "Donante" },
                  { value: "admin", label: "Admin" },
                  { value: "recolector", label: "Recolector" },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition shadow-sm ${
                      role === r.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block font-medium mb-1">E-mail</label>
              <input
                type="email"
                name="email"
                autoComplete="username"
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
                autoComplete="current-password"
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

            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-sm text-gray-500">o</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 font-semibold text-gray-700 hover:bg-gray-100 transition"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6 1.54 7.38 2.83l5.4-5.26C33.66 3.36 29.33 1.5 24 1.5 14.94 1.5 7.02 6.98 3.64 14.9l6.9 5.36C12.27 13.14 17.62 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.5 24.5c0-1.64-.15-3.19-.43-4.69H24v9.04h12.65c-.54 2.86-2.17 5.28-4.59 6.9l7.15 5.55c4.18-3.86 7-9.55 7-16.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.54 28.14a14.44 14.44 0 01-.76-4.64c0-1.61.27-3.17.76-4.64l-6.9-5.36C1.5 16.43 0 20.06 0 24c0 3.94 1.5 7.57 3.64 10.5l6.9-5.36z"
                />
                <path
                  fill="#34A853"
                  d="M24 46.5c5.33 0 9.8-1.76 13.06-4.82l-7.15-5.55c-1.98 1.33-4.52 2.12-7.38 2.12-6.38 0-11.73-3.64-13.46-8.92l-6.9 5.36C7.02 41.02 14.94 46.5 24 46.5z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Continuar con Google
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
      <footer className="bg-slate-900 text-white py-6 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Políticas */}
          <nav className="flex gap-2">
            <NavLink to="/politicsterms" className="text-white hover:underline">
              Políticas de Privacidad
            </NavLink>
            |
            <NavLink to="/politicsterms" className="text-white hover:underline">
              Términos de Uso
            </NavLink>
          </nav>

          {/* Derechos */}
          <p>© DONATY-U Todos los derechos reservados.</p>

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
