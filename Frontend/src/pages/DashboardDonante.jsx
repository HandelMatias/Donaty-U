// src/pages/DashboardDonante.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import storeProfile from "./storeProfile";
import FormProfile from "./FormProfile";
import CardPassword from "./CardPassword";

const DashboardDonante = () => {
const [activeTab, setActiveTab] = useState("perfil");
const navigate = useNavigate();

  // Zustand
const { user, profile, clearUser } = storeProfile();

  // Estado local para vista previa (opcional, pero útil)
const [preview, setPreview] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    telefono: "",
});

  // Cargar perfil desde el backend al entrar al dashboard
useEffect(() => {
    profile(); // GET /perfil con el token
}, [profile]);

  // Cuando llegue "user" desde Zustand, lo volcamos a la vista previa
useEffect(() => {
    if (user) {
    setPreview({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        direccion: user.direccion || "",
        telefono: user.celular || "",
    });
    }
}, [user]);

  // 🔹 Cerrar sesión
const logout = () => {
    localStorage.removeItem("donatyToken");
    localStorage.removeItem("donatyUser");
    clearUser();
    navigate("/login");
};

return (
    <div className="min-h-screen flex bg-[#D3E5FF]">
      {/* Sidebar */}
    <aside className="hidden md:flex flex-col w-64 bg-white shadow-xl px-6 py-8 justify-between">
        {/* Parte superior */}
        <div>
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Donaty-EC</h1>

        <nav className="space-y-3">
            <button
            className={`w-full text-left py-2 px-3 rounded-lg transition font-medium ${
                activeTab === "perfil"
                ? "bg-blue-600 text-white"
                : "hover:bg-blue-100"
            }`}
            onClick={() => setActiveTab("perfil")}
            >
              Perfil
            </button>

            <button
              className={`w-full text-left py-2 px-3 rounded-lg transition font-medium ${
                activeTab === "configuracion"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => setActiveTab("configuracion")}
            >
              Configuración
            </button>

            <button
              className={`w-full text-left py-2 px-3 rounded-lg transition font-medium ${
                activeTab === "donacion"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => setActiveTab("donacion")}
            >
              Donación
            </button>
          </nav>
        </div>

        {/* Botón cerrar sesión abajo */}
        <div className="pb-4">
          <button
            onClick={logout}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 px-6 md:px-10 py-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Panel del Donante
        </h2>

        {/* PERFIL */}
        {activeTab === "perfil" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulario editar perfil (con react-hook-form y PUT) */}
            <div className="bg-white shadow-xl p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Editar Perfil</h3>
              <FormProfile />
            </div>

            {/* Panel derecha */}
            <div className="space-y-6">
              {/* Vista previa */}
              <div className="bg-white p-6 shadow-lg rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Vista Previa</h3>
                <p>
                  <strong>Nombre:</strong> {preview.nombre}
                </p>
                <p>
                  <strong>Apellido:</strong> {preview.apellido}
                </p>
                <p>
                  <strong>Correo electrónico:</strong> {preview.email}
                </p>
                <p>
                  <strong>Dirección:</strong> {preview.direccion}
                </p>
                <p>
                  <strong>Teléfono:</strong> {preview.telefono}
                </p>
              </div>

              {/* Cambiar contraseña */}
              <div className="bg-white p-6 shadow-lg rounded-xl">
                <CardPassword />
              </div>
            </div>
          </div>
        )}

        {/* CONFIGURACIÓN */}
        {activeTab === "configuracion" && (
          <div className="bg-white shadow-xl p-8 rounded-xl">
            <h3 className="text-xl font-semibold">Configuración</h3>
          </div>
        )}

        {/* DONACIÓN */}
        {activeTab === "donacion" && (
          <div className="bg-white shadow-xl p-8 rounded-xl">
            <h3 className="text-xl font-semibold">Donación</h3>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardDonante;
