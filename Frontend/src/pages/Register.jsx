import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";

import Facebook from "/src/assets/facebook.png";
import Whats from "/src/assets/whatsapp.png";
import Insta from "/src/assets/instagram.png";

const Register = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // react-hook-form
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm();

  // Función que se ejecuta al enviar TODO el formulario
  const registerUser = async (dataForm) => {
    // Desestructuración: así llega req.body al backend
    const { nombre, apellido, direccion, celular, email, password } = dataForm;

    const payload = {
      nombre,
      apellido,
      direccion,
      celular,
      email,
      password,
      rol: "DONANTE", // si tu backend maneja roles
    };

    const url = `${import.meta.env.VITE_BACKEND_URL}/registro`;
    console.log("URL backend:", url);
    console.log("Datos enviados al backend:", payload);

    try {
      setLoading(true);

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => null);
        const msg = errorData?.msg || "Error al registrar usuario";
        throw new Error(msg);
      }

      const data = await resp.json().catch(() => ({}));
      console.log("Respuesta del backend:", data);

      toast.success("Registro exitoso. Ahora puedes iniciar sesión.", {
        position: "top-right",
        autoClose: 3000,
      });

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

  // Validar paso 1 antes de ir al 2
  const handleNextStep = async () => {
    const valid = await trigger(["nombre", "apellido", "direccion"]);
    if (!valid) {
      toast.error("Completa los datos personales antes de continuar", {
        position: "top-right",
      });
      return;
    }
    setStep(2);
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
      <section className="relative px-4 md:px-10 py-16 bg-blue-50">
        <div className="relative max-w-3xl mx-auto bg-white rounded-2xl p-8 md:p-10 border border-blue-100 shadow-[0_4px_15px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* pasos */}
          <div className="flex justify-center mb-4 gap-2">
            <div
              className={`h-2 w-8 rounded-full ${
                step === 1 ? "bg-blue-600" : "bg-blue-200"
              }`}
            />
            <div
              className={`h-2 w-8 rounded-full ${
                step === 2 ? "bg-blue-600" : "bg-blue-200"
              }`}
            />
          </div>

          {/* RHF: handleSubmit llama a registerUser */}
          <form onSubmit={handleSubmit(registerUser)}>
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(${step === 1 ? "0" : "-100%"})` }}
            >
              {/* PASO 1 */}
              <div className="min-w-full">
                <h2 className="text-center text-2xl md:text-3xl text-gray-900 font-semibold mb-8">
                  Datos personales
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-800 text-sm md:text-base">
                      Nombre:
                    </label>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                      {...register("nombre", {
                        required: "El nombre es obligatorio",
                      })}
                    />
                    {errors.nombre && (
                      <p className="text-red-700 text-sm">
                        {errors.nombre.message}
                      </p>
                    )}
                  </div>

                  {/* Apellido */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-800 text-sm md:text-base">
                      Apellido:
                    </label>
                    <input
                      type="text"
                      placeholder="Tu apellido"
                      className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                      {...register("apellido", {
                        required: "El apellido es obligatorio",
                      })}
                    />
                    {errors.apellido && (
                      <p className="text-red-700 text-sm">
                        {errors.apellido.message}
                      </p>
                    )}
                  </div>

                  {/* Dirección */}
                  <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-gray-800 text-sm md:text-base">
                      Dirección:
                    </label>
                    <input
                      type="text"
                      placeholder="Tu dirección"
                      className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
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
                </div>

                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mt-8 shadow-md transition"
                >
                  Siguiente →
                </button>
              </div>

              {/* PASO 2 */}
              <div className="min-w-full">
                <h2 className="text-center text-2xl md:text-3xl text-gray-900 font-semibold mb-8">
                  Datos de contacto
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-800 text-sm md:text-base">
                      E-mail:
                    </label>
                    <input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                      {...register("email", {
                        required: "El correo electrónico es obligatorio",
                      })}
                    />
                    {errors.email && (
                      <p className="text-red-700 text-sm">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Celular */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-gray-800 text-sm md:text-base">
                      Teléfono:
                    </label>
                    <input
                      type="text"
                      placeholder="Tu teléfono"
                      className="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                      {...register("celular", {
                        required: "El celular es obligatorio",
                      })}
                    />
                    {errors.celular && (
                      <p className="text-red-700 text-sm">
                        {errors.celular.message}
                      </p>
                    )}
                  </div>

                  {/* Contraseña */}
                  <div className="flex flex-col space-y-1 md:col-span-2">
                    <label className="text-gray-800 text-sm md:text-base">
                      Contraseña:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Tu contraseña"
                        className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-white text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm pr-10"
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
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full md:w-auto bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-lg shadow-sm transition"
                  >
                    ← Atrás
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-5 py-2 rounded-lg shadow-md transition"
                  >
                    {loading ? "Enviando..." : "Enviar ✔"}
                  </button>
                </div>
              </div>
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
            <NavLink to="/politicsterms" className="text-blue-200 hover:underline">
              Políticas de Privacidad
            </NavLink>
            <span>|</span>
            <NavLink to="/politicsterms" className="text-blue-200 hover:underline">
              Términos de Uso
            </NavLink>
          </nav>

          <p className="text-xs md:text-sm">
            © DONATY-EC. Todos los derechos reservados.
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
