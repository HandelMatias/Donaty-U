// src/pages/DashboardDonante.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import storeProfile from "./storeProfile";
import FormProfile from "./FormProfile";
import CardPassword from "./CardPassword";
import DonationForm from "./DonationForm";
import DonationList from "./DonationList";
import { MdLogout } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardDonante = () => {
  const [activeTab, setActiveTab] = useState("perfil");
  const navigate = useNavigate();

  // Zustand
  const { user, profile, clearUser } = storeProfile();

  // Estado local para vista previa
  const [preview, setPreview] = useState({
    nombre: "",
    apellido: "",
    email: "",
    direccion: "",
    telefono: "",
  });

  // apiFetch
  const apiFetch = useCallback(async (path, { method = "GET", body } = {}) => {
    const BASE =
      (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(
        /\/$/,
        ""
      );

    const token = localStorage.getItem("donatyToken");

    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(data?.msg || "Error en la solicitud");
    }

    return data;
  }, []);

  useEffect(() => {
    profile();
  }, [profile]);

  useEffect(() => {
    if (user) {
      setPreview({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        direccion: user.direccion || "",
        telefono: user.telefono || "",
      });
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem("donatyToken");
    localStorage.removeItem("donatyUser");
    clearUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#D3E5FF]">
      <ToastContainer
        position="top-right"
        autoClose={3200}
        newestOnTop
        theme="colored"
        pauseOnHover={false}
      />
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-xl px-6 py-8 justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-700 mb-6">Donaty-U</h1>

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
                activeTab === "donacion"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => setActiveTab("donacion")}
            >
              Donación
            </button>

            {/* ✅ NUEVO: botón lista */}
            <button
              className={`w-full text-left py-2 px-3 rounded-lg transition font-medium ${
                activeTab === "lista"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-100"
              }`}
              onClick={() => setActiveTab("lista")}
            >
              Lista de donaciones
            </button>
          </nav>
        </div>

        <div className="pb-4">
          <button
            onClick={logout}
            className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition inline-flex items-center justify-center gap-2"
          >
            <MdLogout /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido */}
      <main className="flex-1 px-6 md:px-10 py-10">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Panel del Donante {preview?.nombre ? `(${preview.nombre})` : ""}
        </h2>

        {/* PERFIL */}
        {activeTab === "perfil" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white shadow-xl p-8 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Editar Perfil</h3>
              <FormProfile />
            </div>

            <div className="space-y-6">
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

              <div className="bg-white p-6 shadow-lg rounded-xl">
                <CardPassword />
              </div>
            </div>
          </div>
        )}

        {/* DONACIÓN */}
        {activeTab === "donacion" && (
          <div className="space-y-6">
            <DonationForm
              user={user}
              apiFetch={apiFetch}
              onCreated={() => {
                // ✅ NUEVO (sin romper): si luego quieres refrescar al crear
                // setActiveTab("lista"); // opcional, si quieres ir a la lista
              }}
            />
          </div>
        )}

        {/* ✅ LISTA reutilizando componente con panel de edición */}
        {activeTab === "lista" && <DonationList apiFetch={apiFetch} />}
      </main>
    </div>
  );
};

export default DashboardDonante;
