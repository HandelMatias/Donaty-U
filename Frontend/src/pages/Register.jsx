import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ToastContainer, toast } from "react-toastify";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";

import Facebook from "/src/assets/facebook.png";
import Whats from "/src/assets/whatsapp.png";
import Insta from "/src/assets/instagram.png";
import { registerSchema } from "../validation/registerSchema.js";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("donante"); // donante | admin | recolector

  // react-hook-form
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  // Función que se ejecuta al enviar TODO el formulario
  const registerUser = async (dataForm) => {
    // Desestructuración: ya viene validado por Yup
    const { nombre, apellido, direccion, telefono, email, password } = dataForm;

    const payload = {
      nombre,
      apellido,
      direccion,
      telefono,
      email,
      password,
    };

    const base = (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api").replace(/\/$/, "");
    const path =
      role === "admin"
        ? "/admin/registro"
        : role === "recolector"
        ? "/recolector/registro"
        : "/donante/registro";
    const url = `${base}${path}`;
    const adminSecret = import.meta.env.VITE_ADMIN_SECRET || "";
    console.log("URL backend:", url);
    console.log("Datos enviados al backend:", payload);

    try {
      setLoading(true);

      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(role === "admin" && adminSecret
            ? { "x-admin-secret": adminSecret }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => null);
        const msg = errorData?.msg || "Error al registrar usuario";
        throw new Error(msg);
      }

      const data = await resp.json().catch(() => ({}));
      console.log("Respuesta del backend:", data);

      toast.success(
        data?.msg || "Registro exitoso. Revisa tu correo para confirmar tu cuenta.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "No se pudo completar el registro", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />

      {/* HEADER */}
      <header className="bg-[url('https://wallpapercave.com/wp/wp3802831.jpg')] bg-cover bg-center bg-no-repeat bg-black/60 bg-blend-darken flex flex-col h-[90vh]">
        <div className="text-center px-4 py-32 md:py-40">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 md:mb-8">
            ¡Únete a nosotros y sé parte de este hermoso cambio!
          </h1>

          <p className="text-gray-200 text-lg md:text-2xl max-w-3xl md:max-w-4xl mx-auto">
            Juntos podemos llevar esperanza y alegría a los que más lo necesitan.
            Con tu apoyo, no solo entregamos juguetes, ropa, alimentos o ayudas
            económicas; también regalamos sonrisas, esperanza y nuevas
            oportunidades. ¡Tu aporte transforma vidas!
          </p>

          <div className="flex justify-center mt-10">
            <button
              onClick={() =>
                window.scrollBy({ top: 600, behavior: "smooth" })
              }
              className="animate-bounce"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="white"
                className="w-10 h-10 md:w-12 md:h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6l8 8 8-8"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 12l8 8 8-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* REQUISITOS */}
      <section className="px-6 md:px-16 py-10 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 text-gray-800">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">
            Los requisitos para unirse a nuestro equipo son simples:
          </h2>
        </div>

        <div className="space-y-3 text-lg max-w-4xl mx-auto">
          <p>1. Compromiso y solidaridad para ayudar a quienes más lo necesitan.</p>
          <p>
            2. Disponibilidad de tiempo para participar en actividades de
            recolección y entrega.
          </p>
          <p>3. Actitud positiva y trabajo en equipo.</p>
          <p>4. Responsabilidad para cumplir con las tareas asignadas.</p>
          <p>5. Donación de talento o recursos, según tus posibilidades.</p>
        </div>

        <h4 className="text-center mt-6 text-xl font-semibold">
          ¡No se requiere experiencia previa, solo el deseo de hacer el bien!
        </h4>
      </section>

      {/* FORMULARIO MULTIPASO + RHF */}
      <section className="relative px-4 md:px-8 py-8 bg-blue-50">
        <div className="relative max-w-3xl mx-auto bg-white rounded-3xl p-5 md:p-7 border border-blue-100 shadow-[0_16px_40px_rgba(15,23,42,0.12)] overflow-hidden">

          {/* Rol */}
          <div className="mb-6 flex flex-wrap justify-center gap-2">
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

          {/* RHF: handleSubmit llama a registerUser */}
          <form onSubmit={handleSubmit(registerUser)}>
            <h2 className="text-center text-2xl md:text-3xl text-gray-900 font-semibold mb-8">
              Datos de registro
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="flex flex-col space-y-1">
                  <label className="text-gray-800 text-sm md:text-base">
                    Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    className="border border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                    {...register("nombre", {
                      required: "El nombre es obligatorio",
                    })}
                  />
                  {errors.nombre && (
                    <p className="text-red-700 text-sm">{errors.nombre.message}</p>
                  )}
                </div>

                {/* Apellido */}
                <div className="flex flex-col space-y-1">
                  <label className="text-gray-800 text-sm md:text-base">
                    Apellido
                  </label>
                  <input
                    type="text"
                    placeholder="Tu apellido"
                    className="border border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                    {...register("apellido", {
                      required: "El apellido es obligatorio",
                    })}
                  />
                  {errors.apellido && (
                    <p className="text-red-700 text-sm">{errors.apellido.message}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-gray-800 text-sm md:text-base">
                  Dirección
                </label>
                <input
                  type="text"
                  placeholder="Tu dirección"
                  className="border border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                  {...register("direccion", {
                    required: "La dirección es obligatoria",
                  })}
                />
                {errors.direccion && (
                  <p className="text-red-700 text-sm">
                    {errors.direccion.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div className="flex flex-col space-y-1">
                  <label className="text-gray-800 text-sm md:text-base">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="username"
                    placeholder="correo@ejemplo.com"
                    className="border border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                    {...register("email", {
                      required: "El correo electrónico es obligatorio",
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-700 text-sm">{errors.email.message}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="flex flex-col space-y-1">
                  <label className="text-gray-800 text-sm md:text-base">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    placeholder="Tu teléfono"
                    className="border border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                    {...register("telefono", {
                      required: "El teléfono es obligatorio",
                    })}
                  />
                  {errors.telefono && (
                    <p className="text-red-700 text-sm">
                      {errors.telefono.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-gray-800 text-sm md:text-base">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Tu contraseña"
                      className="border border-gray-200 rounded-lg px-4 py-3 w-full bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm pr-10"
                      {...register("password", {
                        required: "La contraseña es obligatoria",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                      aria-label={
                        showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <MdVisibilityOff size={20} />
                      ) : (
                        <MdVisibility size={20} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-700 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 px-8 rounded-lg shadow-md transition"
              >
                {loading ? "Enviando..." : "Registrarme"}
              </button>
            </div>
          </form>
        </div>

        <NavLink
          to="/login"
          className="block text-center mt-6 text-blue-700 hover:text-blue-900 hover:underline"
        >
          Si ya tienes cuenta, puedes iniciar sesión aquí
        </NavLink>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-6 font-sans">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <nav className="flex gap-2 text-sm">
            <NavLink to="/politicsterms" className="text-white hover:underline">
              Políticas de Privacidad
            </NavLink>
            <span>|</span>
            <NavLink to="/politicsterms" className="text-white hover:underline">
              Términos de Uso
            </NavLink>
          </nav>

          <p className="text-xs md:text-sm">
            © DONATY-U Todos los derechos reservados.
          </p>

          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61570160151308"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={Facebook}
                alt="Facebook"
                className="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform"
              />
            </a>
            <a href="https://wa.me/983203628" target="_blank" rel="noreferrer">
              <img
                src={Whats}
                alt="WhatsApp"
                className="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform"
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
                className="w-7 h-7 md:w-8 md:h-8 hover:scale-110 transition-transform"
              />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Register;
