// src/components/ChatRoom.jsx
// Chat en tiempo real para donaciones (roles: donante, admin, recolector)
import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

const getBackendBase = () => {
  const api = (import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api").replace(/\/$/, "");
  // quitar sufijo /api para el socket
  return api.endsWith("/api") ? api.slice(0, -4) : api;
};

const getAuthToken = () => {
  // usa la clave según el rol guardado
  const rol = localStorage.getItem("donatyRole");
  if (rol === "admin") return localStorage.getItem("donatyAdminToken");
  if (rol === "recolector") return localStorage.getItem("donatyRecolectorToken");
  return localStorage.getItem("donatyToken");
};

export default function ChatRoom({
  roomId,
  title = "Chat de la donación",
  tokenOverride,
  roleOverride,
}) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [connecting, setConnecting] = useState(true);
  const [typingUser, setTypingUser] = useState(null);
  const socketRef = useRef(null);
  const listRef = useRef(null);

  const apiBase = useMemo(getBackendBase, []);
  const token = useMemo(() => tokenOverride || getAuthToken(), [tokenOverride]);

  // scroll al final
  const scrollBottom = () => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  // Cargar historial
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const resp = await fetch(`${apiBase}/api/chat/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) throw new Error(data?.msg || "No se pudo cargar el chat");
        setMessages(data.items || []);
        scrollBottom();
      } catch (e) {
        toast.error(e.message);
      }
    };
    if (roomId && token) loadHistory();
  }, [apiBase, roomId, token]);

  // Socket.io
  useEffect(() => {
    if (!roomId || !token) {
      toast.error("Falta roomId o token para el chat");
      return;
    }
    const socket = io(apiBase, {
      auth: { token, role: roleOverride },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnecting(false);
      socket.emit("joinRoom", { roomId });
    });

    socket.on("joinedRoom", () => {
      // ok
    });

    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollBottom();
    });

    socket.on("typing", ({ user }) => {
      setTypingUser(user?.nombre || user?.email || "Alguien");
      setTimeout(() => setTypingUser(null), 1200);
    });

    socket.on("error", (err) => {
      toast.error(err?.msg || "Error en chat");
    });

    return () => {
      socket.emit("leaveRoom", { roomId });
      socket.disconnect();
    };
  }, [apiBase, roomId, token]);

  const sendMessage = (e) => {
    e?.preventDefault();
    if (!text.trim()) return;
    if (!socketRef.current?.connected) {
      return toast.error("Sin conexión al chat");
    }
    socketRef.current.emit("message", { roomId, text: text.trim() });
    setText("");
  };

  const notifyTyping = () => {
    socketRef.current?.emit("typing", { roomId });
  };

  return (
    <div className="bg-white shadow-xl rounded-xl p-4 flex flex-col h-[420px]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
        <span className="text-xs text-gray-500">
          {connecting ? "Conectando..." : "Conectado"}
        </span>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-2 pr-1"
        style={{ scrollbarWidth: "thin" }}
      >
        {messages.map((m) => {
          const labelRol =
            m.senderRol === "donante"
              ? "donante"
              : m.senderRol === "recolector"
              ? "recolector"
              : m.senderRol || "admin";
          const labelNombre = m.senderNombre || m.senderEmail || "Usuario";
          const bubbleClass =
            m.senderRol === "donante"
              ? "bg-blue-50 text-blue-900"
              : m.senderRol === "recolector"
              ? "bg-amber-50 text-amber-900"
              : "bg-slate-800 text-white ml-auto";
          return (
            <div
              key={m._id || `${m.senderId}-${m.createdAt}`}
              className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${bubbleClass}`}
            >
              <div className="text-xs font-semibold opacity-80">
                {labelNombre} ({labelRol})
              </div>
              <div>{m.text}</div>
            </div>
          );
        })}
        {typingUser && (
          <div className="text-xs text-gray-500">{typingUser} está escribiendo...</div>
        )}
      </div>

      <form onSubmit={sendMessage} className="mt-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={notifyTyping}
          placeholder="Escribe tu mensaje…"
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          disabled={!socketRef.current?.connected}
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
