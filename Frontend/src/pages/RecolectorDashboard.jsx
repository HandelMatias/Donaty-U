// src/pages/RecolectorDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import {
  MdAssignmentTurnedIn,
  MdLocalShipping,
  MdRefresh,
  MdLogout,
  MdChat,
} from "react-icons/md";
import Facebook from "/src/assets/facebook.png";
import Whats from "/src/assets/whatsapp.png";
import Insta from "/src/assets/instagram.png";
import ChatRoom from "../components/ChatRoom.jsx";

const useApiRecolector = () => {
  const base = useMemo(
    () =>
      (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(
        /\/$/,
        ""
      ),
    []
  );
  const token = useMemo(
    () => localStorage.getItem("donatyRecolectorToken") || "",
    []
  );

  const call = async (path, { method = "GET", body } = {}) => {
    const res = await fetch(`${base}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.msg || "Error en la solicitud");
    return data;
  };

  return call;
};

const RecolectorDashboard = () => {
  const navigate = useNavigate();
  const api = useApiRecolector();
  const [tab, setTab] = useState("pendientes"); // pendientes | asignadas | perfil
  const [pendientes, setPendientes] = useState([]);
  const [asignadas, setAsignadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatDonacion, setChatDonacion] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [perfilForm, setPerfilForm] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [passForm, setPassForm] = useState({
    passwordactual: "",
    passwordnuevo: "",
  });

  const loadPendientes = async () => {
    setLoading(true);
    try {
      const res = await api("/donacion/pendientes");
      setPendientes(res?.items || res?.donaciones || res || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadAsignadas = async () => {
    setLoading(true);
    try {
      const res = await api("/donacion/asignadas");
      setAsignadas(res?.items || res?.donaciones || res || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "pendientes") loadPendientes();
    if (tab === "asignadas") loadAsignadas();
    if (tab === "perfil") loadPerfil();
  }, [tab]);

  useEffect(() => {
    loadPerfil();
  }, []);

  const tomarDonacion = async (d) => {
    if (!window.confirm("¿Confirmas tomar esta donación?")) return;
    try {
      await api(`/donacion/${d._id}/asignar`, { method: "PATCH" });
      toast.success("Donación asignada a ti");
      loadPendientes();
      loadAsignadas();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const marcarEntregada = async (d) => {
    const idToast = toast.info("Confirma para marcar como entregada", {
      position: "top-right",
      autoClose: 4000,
      closeOnClick: true,
      pauseOnHover: true,
    });

    const confirmed = window.confirm("¿Confirmas marcar como entregada?");
    if (!confirmed) {
      toast.dismiss(idToast);
      return;
    }

    try {
      await api(`/donacion/${d._id}/entregar`, { method: "PATCH" });
      toast.dismiss(idToast);
      toast.success("Donación marcada como entregada");
      loadAsignadas();
    } catch (e) {
      toast.dismiss(idToast);
      toast.error(e.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("donatyRecolectorToken");
    localStorage.removeItem("donatyRole");
    navigate("/login");
  };

  const loadPerfil = async () => {
    setLoading(true);
    try {
      const data = await api("/recolector/perfil");
      setPerfil(data);
      setPerfilForm({
        nombre: data?.nombre || "",
        apellido: data?.apellido || "",
        direccion: data?.direccion || "",
        telefono: data?.telefono || "",
        email: data?.email || "",
      });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarPerfil = async () => {
    if (!perfil?._id) return;
    try {
      setLoading(true);
      await api(`/recolector/actualizarperfil/${perfil._id}`, {
        method: "PUT",
        body: perfilForm,
      });
      toast.success("Perfil actualizado");
      loadPerfil();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const actualizarPassword = async () => {
    if (!perfil?._id) return;
    const { passwordactual, passwordnuevo } = passForm;
    if (!passwordactual || !passwordnuevo) {
      toast.error("Completa ambos campos de Contraseña");
      return;
    }
    try {
      setLoading(true);
      await api(`/recolector/actualizarpassword/${perfil._id}`, {
        method: "PUT",
        body: {
          passwordactual,
          passwordnuevo,
        },
      });
      toast.success("Contraseña actualizada");
      setPassForm({ passwordactual: "", passwordnuevo: "" });
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const Table = ({ data, acciones }) => (
    <div className="bg-white shadow-xl p-6 rounded-xl">
      {loading ? (
        <p>Cargando...</p>
      ) : data.length === 0 ? (
        <p>No hay registros.</p>
      ) : (
        <div className="overflow-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-800 text-slate-200">
              <tr>
                {["Donante", "Tipo", "Categoría", "Dirección", "Estado", "Fecha", "Acciones"].map(
                  (h) => (
                    <th key={h} className="p-2 text-left">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d._id} className="border-b">
                  <td className="p-2">{d?.donante?.nombre || "-"}</td>
                  <td className="p-2">{d.tipo}</td>
                  <td className="p-2">{d.categoria || "-"}</td>
                  <td className="p-2">{d.direccionEntrega || "-"}</td>
                  <td className="p-2">
                    <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                      {d.estado}
                    </span>
                  </td>
                  <td className="p-2">
                    {d.createdAt ? new Date(d.createdAt).toLocaleString() : "-"}
                  </td>
                  <td className="p-2 flex flex-wrap gap-2 items-center">
                    {acciones(d)}
                    <button
                      onClick={() => setChatDonacion(d)}
                      className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded hover:bg-purple-200 inline-flex items-center gap-1"
                      title="Abrir chat"
                    >
                      <MdChat /> Chat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <>
    <div className="min-h-screen flex bg-[#D3E5FF]">
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-xl px-6 py-8 gap-3">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Donaty-U</h1>
        <button
          className={`text-left py-2 px-3 rounded-lg transition font-medium ${
            tab === "pendientes"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100"
          }`}
          onClick={() => setTab("pendientes")}
        >
          Pendientes
        </button>
        <button
          className={`text-left py-2 px-3 rounded-lg transition font-medium ${
            tab === "asignadas"
              ? "bg-blue-600 text-white"
              : "hover:bg-blue-100"
          }`}
          onClick={() => setTab("asignadas")}
        >
          Mis asignadas
        </button>
        <button
          className={`text-left py-2 px-3 rounded-lg transition font-medium ${
            tab === "perfil" ? "bg-blue-600 text-white" : "hover:bg-blue-100"
          }`}
          onClick={() => setTab("perfil")}
        >
          Mi perfil
        </button>
        <div className="flex-1" />
        <button
          onClick={logout}
          className="w-full text-center py-2 px-3 rounded-lg transition font-medium bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
        >
          <MdLogout /> Cerrar sesión
        </button>
      </aside>

      <main className="flex-1 px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">
            Panel Recolector —{" "}
            {tab === "pendientes"
              ? "Pendientes"
              : tab === "asignadas"
              ? "Asignadas"
              : "Mi perfil"}
            {perfilForm?.nombre ? ` (${perfilForm.nombre})` : ""}
          </h2>
          <button
            onClick={() => {
              tab === "pendientes" ? loadPendientes() : loadAsignadas();
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            <MdRefresh /> Refrescar
          </button>
        </div>

        {tab === "pendientes" && (
          <Table
            data={pendientes}
            acciones={(d) => (
              <button
                onClick={() => tomarDonacion(d)}
                className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200 inline-flex items-center gap-1"
              >
                <MdAssignmentTurnedIn /> Tomar
              </button>
            )}
          />
        )}

        {tab === "asignadas" && (
          <Table
            data={asignadas}
            acciones={(d) => (
              <button
                onClick={() => marcarEntregada(d)}
                className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200 inline-flex items-center gap-1"
              >
                <MdLocalShipping /> Entregada
              </button>
            )}
          />
        )}

        {tab === "perfil" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editar perfil */}
            <div className="bg-white shadow-xl p-6 rounded-xl lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Editar Perfil</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "nombre", label: "Nombre" },
                    { name: "apellido", label: "Apellido" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {f.label}
                      </label>
                      <input
                        value={perfilForm[f.name] || ""}
                        onChange={(e) =>
                          setPerfilForm((s) => ({ ...s, [f.name]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "email", label: "Correo electrónico" },
                    { name: "telefono", label: "Teléfono" },
                  ].map((f) => (
                    <div key={f.name}>
                      <label className="block text-sm font-medium text-gray-800 mb-1">
                        {f.label}
                      </label>
                      <input
                        value={perfilForm[f.name] || ""}
                        onChange={(e) =>
                          setPerfilForm((s) => ({ ...s, [f.name]: e.target.value }))
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Dirección
                  </label>
                  <input
                    value={perfilForm.direccion || ""}
                    onChange={(e) =>
                      setPerfilForm((s) => ({ ...s, direccion: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <button
                  onClick={actualizarPerfil}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                >
                  Guardar cambios
                </button>
              </div>
            </div>

            {/* Vista previa + cambio Contraseña */}
            <div className="space-y-4">
              <div className="bg-white shadow-xl p-6 rounded-xl">
                <h4 className="text-lg font-semibold mb-3">Vista Previa</h4>
                <p>
                  <b>Nombre:</b> {perfilForm.nombre || "-"}
                </p>
                <p>
                  <b>Apellido:</b> {perfilForm.apellido || "-"}
                </p>
                <p>
                  <b>Correo electrónico:</b> {perfilForm.email || "-"}
                </p>
                <p>
                  <b>Dirección:</b> {perfilForm.direccion || "-"}
                </p>
                <p>
                  <b>Teléfono:</b> {perfilForm.telefono || "-"}
                </p>
              </div>

              <div className="bg-white shadow-xl p-6 rounded-xl">
                <h4 className="text-lg font-semibold mb-3">
                  Cambiar Contraseña
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Contraseña actual
                    </label>
                    <input
                      type="password"
                      value={passForm.passwordactual}
                      onChange={(e) =>
                        setPassForm((s) => ({ ...s, passwordactual: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Nueva Contraseña
                    </label>
                    <input
                      type="password"
                      value={passForm.passwordnuevo}
                      onChange={(e) =>
                        setPassForm((s) => ({ ...s, passwordnuevo: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <button
                    onClick={actualizarPassword}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
                  >
                    Cambiar Contraseña
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>

    {chatDonacion && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-4 relative">
            <button
              onClick={() => setChatDonacion(null)}
              className="absolute top-3 right-3 text-sm text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-3">
              Chat — Donación ({chatDonacion?.categoria || "Sin categoría"})
            </h3>
          <ChatRoom
            roomId={chatDonacion?._id}
            title="Chat con donante"
            tokenOverride={localStorage.getItem("donatyRecolectorToken")}
            roleOverride="recolector"
          />
          </div>
        </div>
      )}

    <footer className="bg-slate-900 text-white py-6 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 px-4">
        <nav className="flex gap-2">
          <NavLink to="/politicsterms" className="text-white hover:underline">
            Políticas de Privacidad
          </NavLink>
          |
          <NavLink to="/politicsterms" className="text-white hover:underline">
            Términos de Uso
          </NavLink>
        </nav>

        <p className="text-center">© DONATY-U Todos los derechos reservados.</p>

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
    </>
  );
};

export default RecolectorDashboard;





