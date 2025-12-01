// src/pages/Reset.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logoDog from "../assets/LogoDEc.png";

const Reset = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [tokenValid, setTokenValid] = useState(null); // null = cargando, true = ok, false = inválido
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        setLoadingVerify(true);
        const url = `${import.meta.env.VITE_BACKEND_URL}/recuperarpassword/${token}`;
        console.log("Verificando token en:", url);

        const resp = await fetch(url);
        const data = await resp.json().catch(() => ({}));

        if (!resp.ok) {
          const msg = data?.msg || "Enlace inválido o expirado.";
          throw new Error(msg);
        }

        setTokenValid(true);
        toast.success(
          data?.msg || "Token válido, ahora puedes cambiar tu contraseña.",
          { position: "top-right", autoClose: 3000 }
        );
      } catch (error) {
        console.error(error);
        setTokenValid(false);
        toast.error(error.message || "Enlace inválido o expirado.", {
          position: "top-right",
          autoClose: 4000,
        });
      } finally {
        setLoadingVerify(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !password2) {
      toast.error("Debes completar ambos campos de contraseña.", {
        position: "top-right",
      });
      return;
    }

    if (password !== password2) {
      toast.error("Las contraseñas no coinciden.", {
        position: "top-right",
      });
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.", {
        position: "top-right",
      });
      return;
    }

    try {
      setLoadingSubmit(true);
      const url = `${import.meta.env.VITE_BACKEND_URL}/nuevopassword/${token}`;
      console.log("Enviando nueva contraseña a:", url);

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ⬇️ IMPORTANTE: mandamos también la confirmación
        body: JSON.stringify({
          password,
          confirmpassword: password2, // coincide con el backend
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        const msg = data?.msg || "No se pudo actualizar la contraseña.";
        throw new Error(msg);
      }

      toast.success(
        data?.msg || "Contraseña actualizada correctamente.",
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
      toast.error(error.message || "Error al actualizar la contraseña.", {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-50 px-4">
      <ToastContainer />

      <h1 className="text-3xl font-semibold mb-2 text-center text-slate-700">
        Bienvenido nuevamente
      </h1>
      <small className="text-gray-500 block my-2 text-sm text-center">
        Por favor, ingresa tu nueva contraseña
      </small>

      <img
        className="object-cover h-40 w-40 rounded-full border-4 border-solid border-slate-600 mb-6"
        src={logoDog}
        alt="Donaty reset"
      />

      {tokenValid === null && (
        <p className="text-gray-600 text-sm">Verificando enlace...</p>
      )}

      {tokenValid === false && !loadingVerify && (
        <p className="text-red-700 text-sm text-center max-w-xs">
          El enlace para restablecer la contraseña es inválido o ha expirado.
          Solicita nuevamente la recuperación desde la opción
          {" "}“¿Olvidaste tu contraseña?”.
        </p>
      )}

      {tokenValid && !loadingVerify && (
        <form className="w-full max-w-xs mt-4" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="mb-2 block text-sm font-semibold">
              Nueva contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa tu nueva contraseña"
              className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label className="mt-4 mb-2 block text-sm font-semibold">
              Confirmar contraseña
            </label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <button
              type="submit"
              disabled={loadingSubmit}
              className="bg-blue-600 text-slate-100 border py-2 
                         w-full rounded-xl mt-5 hover:scale-105 duration-300 
                         hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loadingSubmit ? "Enviando..." : "Guardar nueva contraseña"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Reset;
