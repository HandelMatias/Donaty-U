// src/pages/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  MdPeople,
  MdInventory,
  MdCategory,
  MdRefresh,
  MdDeleteForever,
  MdPersonAddAlt1,
  MdSettings,
  MdChat,
} from "react-icons/md";
import { useNavigate, NavLink } from "react-router-dom";
import Facebook from "/src/assets/facebook.png";
import Whats from "/src/assets/whatsapp.png";
import Insta from "/src/assets/instagram.png";
import { MdLogout } from "react-icons/md";
import ChatRoom from "../components/ChatRoom.jsx";

const useApiAdmin = () => {
  const base = useMemo(
    () =>
      (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(
        /\/$/,
        ""
      ),
    []
  );

  const token = useMemo(
    () => localStorage.getItem("donatyAdminToken") || "",
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
    if (!res.ok) {
      throw new Error(data?.msg || "Error en la solicitud");
    }
    return data;
  };

  return call;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const api = useApiAdmin();
  const [tab, setTab] = useState("usuarios"); // usuarios | donaciones | categorias | perfil
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [recolectores, setRecolectores] = useState([]);
  const [donaciones, setDonaciones] = useState([]);
  const [categorias, setCategorias] = useState([
    { nombre: "Alimentos", descripcion: "Perecibles y no perecibles" },
    { nombre: "Ropa", descripcion: "Vestimenta en buen estado" },
  ]);
  const [nuevoDonante, setNuevoDonante] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
    rol: "donante", // donante | recolector
  });
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
  const [chatDonacion, setChatDonacion] = useState(null);

  // loaders
  const loadUsuarios = async () => {
    setLoading(true);
    try {
      const res = await api("/admin/users?limit=50");
      setUsuarios(res?.items || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRecolectores = async () => {
    setLoading(true);
    try {
      const res = await api("/admin/recolectores?limit=50");
      setRecolectores(res?.items || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDonaciones = async () => {
    setLoading(true);
    try {
      const res = await api("/donacion");
      setDonaciones(res?.items || res?.donaciones || []);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadPerfil = async () => {
    setLoading(true);
    try {
      const data = await api("/admin/perfil");
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

  useEffect(() => {
    if (tab === "usuarios") loadUsuarios();
    if (tab === "usuarios") loadRecolectores();
    if (tab === "donaciones") loadDonaciones();
    if (tab === "perfil") loadPerfil();
  }, [tab]);

  // cargar perfil al entrar (para mostrar nombre en encabezado)
  useEffect(() => {
    loadPerfil();
  }, []);

  const toggleStatus = async (u) => {
    try {
      await api(`/admin/users/${u._id}/status`, {
        method: "PATCH",
        body: { status: !u.status },
      });
      toast.success("Estado actualizado");
      loadUsuarios();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const toggleStatusRecolector = async (r) => {
    try {
      await api(`/admin/recolectores/${r._id}/status`, {
        method: "PATCH",
        body: { status: !r.status },
      });
      toast.success("Estado actualizado");
      loadRecolectores();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const updateEstadoDonacion = async (d, estado) => {
    try {
      await api(`/donacion/${d._id}/estado`, {
        method: "PATCH",
        body: { estado },
      });
      toast.success("Donación actualizada");
      loadDonaciones();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const eliminarDonacion = async (d) => {
    try {
      await api(`/donacion/${d._id}/estado`, {
        method: "PATCH",
        body: { estado: "cancelada" },
      });
      toast.success("Donación cancelada");
      loadDonaciones();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const actualizarPerfil = async () => {
    if (!perfil?._id) return;
    try {
      setLoading(true);
      await api(`/admin/actualizarperfil/${perfil._id}`, {
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
      toast.error("Completa ambos campos de contraseña");
      return;
    }
    try {
      setLoading(true);
      await api(`/admin/actualizarpassword/${perfil._id}`, {
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

  const crearDonante = async () => {
    const { nombre, apellido, email, telefono, direccion, password, rol } =
      nuevoDonante;
    if (!nombre || !apellido || !email || !telefono || !direccion || !password) {
      toast.error("Completa todos los campos");
      return;
    }
    const target =
      rol === "recolector" ? "/recolector/registro" : "/donante/registro";
    try {
      setLoading(true);
      await api(target, {
        method: "POST",
        body: { nombre, apellido, direccion, telefono, email, password },
      });
      toast.success(
        rol === "recolector"
          ? "Recolector creado (confirmar por correo)"
          : "Donante creado (confirmar por correo)"
      );
      setNuevoDonante({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
        password: "",
        rol: "donante",
      });
      loadUsuarios();
      loadRecolectores();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("donatyAdminToken");
    localStorage.removeItem("donatyRole");
    navigate("/login");
  };

  return (
    <>
      <div className="min-h-screen flex bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Sidebar simple */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shadow-xl px-6 py-8 gap-3 text-slate-100">
        <h1 className="text-2xl font-bold text-amber-400 mb-4">Donaty-U</h1>
        <button
          className={`text-left py-2 px-3 rounded-lg transition font-medium ${
            tab === "usuarios"
              ? "bg-amber-500 text-slate-900"
              : "hover:bg-slate-800 text-slate-100"
          }`}
          onClick={() => setTab("usuarios")}
        >
          Usuarios
        </button>
        <button
          className={`text-left py-2 px-3 rounded-lg transition font-medium ${
            tab === "donaciones"
              ? "bg-amber-500 text-slate-900"
              : "hover:bg-slate-800 text-slate-100"
          }`}
          onClick={() => setTab("donaciones")}
        >
          Donaciones
        </button>
        <button
          className={`text-left py-2 px-3 rounded-lg transition font-medium ${
            tab === "categorias"
              ? "bg-amber-500 text-slate-900"
              : "hover:bg-slate-800 text-slate-100"
          }`}
          onClick={() => setTab("categorias")}
        >
          Categorías
        </button>
        <button
          className={`text-left py-2 px-3 rounded-lg transition font-medium ${
            tab === "perfil"
              ? "bg-amber-500 text-slate-900"
              : "hover:bg-slate-800 text-slate-100"
          }`}
          onClick={() => setTab("perfil")}
        >
          Mi perfil
        </button>
        <div className="flex-1" />
        <button
          onClick={logout}
          className="mt-4 w-full text-center py-2 px-3 rounded-lg transition font-medium bg-red-600 text-white hover:bg-red-700 inline-flex items-center justify-center gap-2"
        >
          <MdLogout /> Cerrar sesión
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-amber-100">
            Panel Admin — {tab === "usuarios" && "Usuarios"}
            {tab === "donaciones" && "Donaciones"}
            {tab === "categorias" && "Categorías"}
            {tab === "perfil" && "Mi perfil"}
            {perfil?.nombre ? ` (${perfil.nombre})` : ""}
          </h2>
          <button
            onClick={() => {
              if (tab === "usuarios") loadUsuarios();
              if (tab === "donaciones") loadDonaciones();
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            <MdRefresh /> Refrescar
          </button>
        </div>

        {/* Usuarios */}
        {tab === "usuarios" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white shadow-xl p-6 rounded-xl lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4 text-gray-700">
                  <MdPeople className="text-blue-600" /> Usuarios (donantes)
                </div>
                {loading ? (
                  <p>Cargando...</p>
                ) : usuarios.length === 0 ? (
                  <p>No hay usuarios.</p>
                ) : (
                  <div className="overflow-auto">
                    <table className="w-full table-auto">
                      <thead className="bg-gray-800 text-slate-200">
                        <tr>
                          {["Nombre", "Email", "Estado", "Fecha"].map((h) => (
                            <th key={h} className="p-2 text-left">
                              {h}
                            </th>
                          ))}
                          <th className="p-2 text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map((u) => (
                          <tr key={u._id} className="border-b">
                            <td className="p-2">
                              {u.nombre} {u.apellido}
                            </td>
                            <td className="p-2">{u.email}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  u.status
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {u.status ? "Activo" : "Inactivo"}
                              </span>
                            </td>
                            <td className="p-2">
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="p-2">
                              <button
                                onClick={() => toggleStatus(u)}
                                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                              >
                                {u.status ? "Desactivar" : "Activar"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4 text-gray-700">
                  <MdPeople className="text-amber-500" /> Recolectores
                </div>
                {loading ? (
                  <p>Cargando...</p>
                ) : recolectores.length === 0 ? (
                  <p>No hay recolectores.</p>
                ) : (
                  <div className="overflow-auto">
                    <table className="w-full table-auto">
                      <thead className="bg-gray-800 text-slate-200">
                        <tr>
                          {["Nombre", "Email", "Estado", "Fecha"].map((h) => (
                            <th key={h} className="p-2 text-left">
                              {h}
                            </th>
                          ))}
                          <th className="p-2 text-left">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recolectores.map((r) => (
                          <tr key={r._id} className="border-b">
                            <td className="p-2">
                              {r.nombre} {r.apellido}
                            </td>
                            <td className="p-2">{r.email}</td>
                            <td className="p-2">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  r.status
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {r.status ? "Activo" : "Inactivo"}
                              </span>
                            </td>
                            <td className="p-2">
                              {r.createdAt
                                ? new Date(r.createdAt).toLocaleDateString()
                                : "-"}
                            </td>
                            <td className="p-2">
                              <button
                                onClick={() => toggleStatusRecolector(r)}
                                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                              >
                                {r.status ? "Desactivar" : "Activar"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Form crear usuario (donante o recolector) */}
            <div className="bg-white shadow-xl p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-4 text-gray-700">
                <MdPersonAddAlt1 className="text-blue-600" /> Crear usuario
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Rol
                  </label>
                  <select
                    value={nuevoDonante.rol}
                    onChange={(e) =>
                      setNuevoDonante((s) => ({ ...s, rol: e.target.value }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="donante">Donante</option>
                    <option value="recolector">Recolector</option>
                  </select>
                </div>
                {[
                  { name: "nombre", label: "Nombre" },
                  { name: "apellido", label: "Apellido" },
                  { name: "email", label: "Email" },
                  { name: "telefono", label: "Teléfono" },
                  { name: "direccion", label: "Dirección" },
                  { name: "password", label: "Contraseña" },
                ].map((f) => (
                  <div key={f.name}>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      {f.label}
                    </label>
                    <input
                      type={f.name === "password" ? "password" : "text"}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                      value={nuevoDonante[f.name]}
                      onChange={(e) =>
                        setNuevoDonante((s) => ({
                          ...s,
                          [f.name]: e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}
                <button
                  onClick={crearDonante}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                >
                  Crear usuario
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Donaciones */}
        {tab === "donaciones" && (
          <div className="bg-white shadow-xl p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <MdInventory className="text-blue-600" /> Donaciones
            </div>
            {loading ? (
              <p>Cargando...</p>
            ) : donaciones.length === 0 ? (
              <p>No hay donaciones.</p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-800 text-slate-200">
                    <tr>
                      {[
                        "Donante",
                        "Tipo",
                        "Categoría",
                        "Monto",
                        "Estado",
                        "Fecha",
                        "Acciones",
                      ].map((h) => (
                        <th key={h} className="p-2 text-left">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {donaciones.map((d) => (
                      <tr key={d._id} className="border-b">
                        <td className="p-2">
                          {d?.donante?.nombre || d?.donante || "-"}
                        </td>
                        <td className="p-2">{d.tipo}</td>
                        <td className="p-2">{d.categoria || "-"}</td>
                        <td className="p-2">
                          {d.tipo === "dinero" ? `${d.monto} ${d.moneda}` : "-"}
                        </td>
                        <td className="p-2">
                          <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                            {d.estado}
                          </span>
                        </td>
                        <td className="p-2">
                          {d.createdAt
                            ? new Date(d.createdAt).toLocaleString()
                            : "-"}
                        </td>
                        <td className="p-2 flex gap-2 flex-wrap">
                          {["pendiente", "asignada", "entregada"].map((est) => (
                            <button
                              key={est}
                              onClick={() => updateEstadoDonacion(d, est)}
                              className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded hover:bg-gray-200"
                            >
                              {est}
                            </button>
                          ))}
                          <button
                            onClick={() => eliminarDonacion(d)}
                            className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200 inline-flex items-center gap-1"
                            title="Cancelar/Eliminar"
                          >
                            <MdDeleteForever /> Eliminar
                          </button>
                          <button
                            onClick={() => setChatDonacion(d)}
                            className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded hover:bg-purple-200 inline-flex items-center gap-1"
                            title="Chat"
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
        )}

        {/* Categorías (placeholder) */}
        {tab === "categorias" && (
          <div className="bg-white shadow-xl p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <MdCategory className="text-blue-600" /> Categorías
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Endpoint de categorías aún no disponible. Datos de muestra:
            </p>
            <ul className="space-y-2">
              {categorias.map((c) => (
                <li
                  key={c.nombre}
                  className="border border-gray-200 rounded-lg p-3 shadow-sm flex justify-between"
                >
                  <div>
                    <p className="font-semibold">{c.nombre}</p>
                    <p className="text-sm text-gray-600">{c.descripcion}</p>
                  </div>
                  <button
                    disabled
                    className="text-xs bg-gray-200 text-gray-500 px-3 py-1 rounded cursor-not-allowed"
                    title="Próximamente"
                  >
                    Editar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Perfil */}
        {tab === "perfil" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editar perfil */}
            <div className="bg-white shadow-xl p-6 rounded-xl lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">Editar Perfil</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Nombre
                    </label>
                    <input
                      value={perfilForm.nombre || ""}
                      onChange={(e) =>
                        setPerfilForm((s) => ({ ...s, nombre: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Apellido
                    </label>
                    <input
                      value={perfilForm.apellido || ""}
                      onChange={(e) =>
                        setPerfilForm((s) => ({ ...s, apellido: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      value={perfilForm.email || ""}
                      onChange={(e) =>
                        setPerfilForm((s) => ({ ...s, email: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-1">
                      Teléfono
                    </label>
                    <input
                      value={perfilForm.telefono || ""}
                      onChange={(e) =>
                        setPerfilForm((s) => ({ ...s, telefono: e.target.value }))
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
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

            {/* Vista previa + cambio contraseña */}
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
                <h4 className="text-lg font-semibold mb-3">Cambiar contraseña</h4>
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
                      Nueva contraseña
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
                    Cambiar contraseña
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
              title="Chat como admin"
              tokenOverride={localStorage.getItem("donatyAdminToken")}
              roleOverride="admin"
            />
          </div>
        </div>
      )}

      {/* Footer (mismo estilo que Home) */}
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

export default AdminDashboard;
