// src/pages/CardPassword.jsx
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import storeProfile from "../pages/storeProfile";
import storeAuth from "../pages/storeAuth";

const CardPassword = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { user, updatePasswordProfile } = storeProfile();
  const { clearToken } = storeAuth();

  const updatePassword = async (dataForm) => {
    if (!user?._id) {
      return;
    }

    const url = `${import.meta.env.VITE_BACKEND_URL}/actualizarpassword/${user._id}`;
    const response = await updatePasswordProfile(url, dataForm);

    // Si el backend responde 200, limpiamos el formulario y cerramos sesión
    if (response?.status === 200) {
      reset();
      clearToken(); // borra token del store y de localStorage (como lo definimos antes)
      // si quieres, aquí podrías hacer navigate('/login') desde el Dashboard
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="bg-white p-6 shadow-lg rounded-xl mt-6">
        <h3 className="text-xl font-semibold mb-4">Cambiar Contraseña</h3>

        <form onSubmit={handleSubmit(updatePassword)}>
          {/* Contraseña actual */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Contraseña actual
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña actual"
              className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-700 mb-4"
              {...register("passwordactual", {
                required: "La contraseña actual es obligatoria",
              })}
            />
            {errors.passwordactual && (
              <p className="text-red-700 text-sm">
                {errors.passwordactual.message}
              </p>
            )}
          </div>

          {/* Nueva contraseña */}
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Nueva contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa la nueva contraseña"
              className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-700 mb-4"
              {...register("passwordnuevo", {
                required: "La nueva contraseña es obligatoria",
              })}
            />
            {errors.passwordnuevo && (
              <p className="text-red-700 text-sm">
                {errors.passwordnuevo.message}
              </p>
            )}
          </div>

          <input
            type="submit"
            className="bg-emerald-600 w-full p-2 text-slate-100 uppercase 
                       font-bold rounded-lg hover:bg-emerald-700 cursor-pointer transition-all"
            value="Cambiar contraseña"
          />
        </form>
      </div>
    </>
  );
};

export default CardPassword;
