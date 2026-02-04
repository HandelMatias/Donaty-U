// src/pages/DonationsList.jsx
import { useEffect, useState } from "react";
import { MdDeleteForever, MdPublishedWithChanges, MdChat } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import ChatRoom from "../components/ChatRoom.jsx";
import "react-toastify/dist/ReactToastify.css";

const fmtMoney = (cents, currency = "usd") => {
  if (cents == null) return "-";
  const val = Number(cents) / 100;
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: (currency || "USD").toUpperCase(),
  }).format(val);
};

export default function DonationsList({ apiFetch }) {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const deliveryOptions = [
    "Facultad de Ciencias",
    "Facultad de Ciencias Administrativas",
    "Facultad de Ingeniería Civil y Ambiental (FICA)",
    "Facultad de Ingeniería Eléctrica y Electrónica",
    "Facultad de Ingeniería Mecánica",
    "Facultad de Ingeniería en Sistemas (FIS)",
    "Facultad de Ingeniería Química y Agroindustria",
    "Facultad de Geología y Petróleos",
    "Escuela de Formación de Tecnólogos (ESFOT)",
  ];

  // panel de edición
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState({
    categoria: "",
    descripcion: "",
    direccionEntrega: "",
    telefonoContacto: "",
  });
  const [chatDonacion, setChatDonacion] = useState(null);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/donacion/mis", { method: "GET" });
      setDonaciones(
        Array.isArray(data)
          ? data
          : data?.items || data?.donaciones || []
      );
    } catch (e) {
      toast.error(e.message || "No se pudo cargar donaciones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const abrirEditar = (d) => {
    setSelected(d);
    setEditForm({
      categoria: d.categoria || "",
      descripcion: d.descripcion || "",
      direccionEntrega: d.direccionEntrega || "",
      telefonoContacto: d.telefonoContacto || "",
    });
  };

  const guardarEdicion = async () => {
    try {
      await apiFetch(`/donacion/${selected?._id}`, {
        method: "PATCH",
        body: editForm,
      });

      // ✅ ÚNICO CAMBIO AQUÍ
      toast.success("Donación Actualizada", {
        position: "top-right",
        autoClose: 3200,
        theme: "colored",
        icon: "✅",
        pauseOnHover: false,
      });

      setSelected(null);
      await cargar();
    } catch (e) {
      toast.error(e.message || "No se pudo actualizar");
    }
  };

  const eliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar esta donación?")) return;
    try {
      await apiFetch(`/donacion/${id}`, { method: "DELETE" });
      toast.success("Donación eliminada");
      setDonaciones((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      toast.error(e.message || "No se pudo eliminar");
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-xl p-6 rounded-xl">
        Cargando donaciones...
      </div>
    );
  }

  if (!donaciones.length) {
    return (
      <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
        <span className="font-medium">No existen donaciones registradas</span>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3200}
        newestOnTop
        theme="colored"
        pauseOnHover={false}
      />

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Lista */}
        <div className="bg-white shadow-xl p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Mis Donaciones</h3>
            <button
              onClick={cargar}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Refrescar
            </button>
          </div>

          <div className="overflow-auto">
            <table className="w-full table-auto shadow-lg bg-white rounded-lg">
              <thead className="bg-gray-800 text-slate-200">
                <tr>
                  {[
                    "N°",
                    "Tipo",
                    "Categoría",
                    "Descripción",
                    "Monto",
                    "Estado",
                    "Acciones",
                  ].map((h) => (
                    <th key={h} className="p-2 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {donaciones.map((d, idx) => (
                  <tr
                    key={d._id}
                    className={`border-b hover:bg-gray-100 ${
                      selected?._id === d._id ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="p-2">{idx + 1}</td>
                    <td className="p-2">{d.tipo || "-"}</td>
                    <td className="p-2">{d.categoria || "-"}</td>
                    <td className="p-2">{d.descripcion || "-"}</td>
                    <td className="p-2">
                      {d.tipo === "dinero"
                        ? fmtMoney(d.monto, d.moneda)
                        : "-"}
                    </td>
                    <td className="p-2">
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded">
                        {d.estado || "PENDIENTE"}
                      </span>
                    </td>

                  <td className="p-2 flex items-center gap-3 flex-wrap">
                    <MdPublishedWithChanges
                      title="Actualizar"
                      className="h-7 w-7 text-slate-800 cursor-pointer hover:text-blue-600"
                      onClick={() => abrirEditar(d)}
                    />
                    <MdDeleteForever
                      title="Eliminar"
                      className="h-7 w-7 text-red-700 cursor-pointer hover:text-red-600"
                      onClick={() => eliminar(d._id)}
                    />
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
        </div>

        {/* Panel de edición */}
        <div className="bg-white shadow-xl p-6 rounded-xl">
          <h4 className="text-lg font-semibold mb-4">
            {selected
              ? "Editar donación seleccionada"
              : "Selecciona una donación"}
          </h4>

          {!selected ? (
            <p className="text-sm text-gray-600">
              Haz clic en el ícono de actualizar de la lista para cargar la
              donación aquí.
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Categoría
                </label>
                <input
                  value={editForm.categoria}
                  onChange={(e) =>
                    setEditForm((s) => ({
                      ...s,
                      categoria: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Descripción
                </label>
                <textarea
                  value={editForm.descripcion}
                  onChange={(e) =>
                    setEditForm((s) => ({
                      ...s,
                      descripcion: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Dirección (si aplica)
                  </label>
                  <select
                    value={editForm.direccionEntrega}
                    onChange={(e) =>
                      setEditForm((s) => ({
                        ...s,
                        direccionEntrega: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                  >
                    <option value="">Selecciona un punto</option>
                    {deliveryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Teléfono (si aplica)
                  </label>
                  <input
                    value={editForm.telefonoContacto}
                    onChange={(e) =>
                      setEditForm((s) => ({
                        ...s,
                        telefonoContacto: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    setSelected(null);
                    setEditForm({
                      categoria: "",
                      descripcion: "",
                      direccionEntrega: "",
                      telefonoContacto: "",
                    });
                  }}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={guardarEdicion}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Guardar cambios
                </button>
              </div>
            </div>
          )}
        </div>
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
              title="Chat con admin/recolector"
              tokenOverride={localStorage.getItem("donatyToken")}
              roleOverride="donante"
            />
          </div>
        </div>
      )}
    </>
  );
}
