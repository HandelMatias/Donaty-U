// src/pages/AiSimilarity.jsx
// Pequeña herramienta para probar el endpoint /api/ai/index (embeddings + similitud)
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getBase = () =>
  (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

export default function AiSimilarity() {
  const [text, setText] = useState("");
  const [topK, setTopK] = useState(5);
  const [minScore, setMinScore] = useState(0);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if (!text.trim()) {
      toast.error("Escribe un texto");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${getBase()}/ai/index`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, topK: Number(topK) || 5, minScore: Number(minScore) || 0 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.msg || "Error llamando /ai/index");
      setMatches(data.matches || []);
      toast.success("Embedding creado y matches calculados");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D3E5FF] flex flex-col items-center px-4 py-10">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <div className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-3xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Probar IA (embeddings)</h1>
          <p className="text-sm text-gray-600">
            Envía un texto a <code>/api/ai/index</code>, guarda su embedding y devuelve coincidencias
            con textos previamente indexados.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">Texto</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Escribe aquí la descripción o nota..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">topK</label>
              <input
                type="number"
                value={topK}
                min={1}
                max={50}
                onChange={(e) => setTopK(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">minScore</label>
              <input
                type="number"
                step="0.01"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Procesando..." : "Enviar a /api/ai/index"}
          </button>
        </form>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Matches</h3>
          {matches.length === 0 ? (
            <p className="text-sm text-gray-600">No hay coincidencias (aún).</p>
          ) : (
            <ul className="space-y-2">
              {matches.map((m) => (
                <li
                  key={m.id}
                  className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex justify-between items-start gap-3"
                >
                  <div>
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{m.text}</p>
                    {m.meta && Object.keys(m.meta).length > 0 && (
                      <p className="text-xs text-gray-500">meta: {JSON.stringify(m.meta)}</p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-blue-700">
                    {Number(m.score).toFixed(3)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
