// src/pages/FormProfile.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import storeProfile from "./storeProfile";

const FormProfile = () => {
  const { user, updateProfile } = storeProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const updateUser = (dataForm) => {
    if (!user?._id) return;
    const url = `${import.meta.env.VITE_BACKEND_URL}/donante/actualizarperfil/${user._id}`;
    updateProfile(url, dataForm);
  };

  useEffect(() => {
    if (user) {
      reset({
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        direccion: user.direccion,
        telefono: user.telefono,
      });
    }
  }, [user, reset]);

  return (
    <form onSubmit={handleSubmit(updateUser)}>
      <ToastContainer />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-700"
            {...register("nombre", { required: "El nombre es obligatorio" })}
          />
          {errors.nombre && (
            <p className="text-red-700 text-sm">{errors.nombre.message}</p>
          )}
        </div>

        {/* Apellido */}
        <div>
          <label className="block text-sm font-semibold mb-1">Apellido</label>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-700"
            {...register("apellido", { required: "El apellido es obligatorio" })}
          />
          {errors.apellido && (
            <p className="text-red-700 text-sm">{errors.apellido.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-700"
            {...register("email", { required: "El correo es obligatorio" })}
          />
          {errors.email && (
            <p className="text-red-700 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-semibold mb-1">Dirección</label>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-700"
            {...register("direccion", { required: "La dirección es obligatoria" })}
          />
          {errors.direccion && (
            <p className="text-red-700 text-sm">{errors.direccion.message}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-semibold mb-1">Teléfono</label>
          <input
            type="text"
            className="block w-full rounded-md border border-gray-300 py-2 px-2 text-gray-700"
            {...register("telefono", { required: "El teléfono es obligatorio" })}
          />
          {errors.telefono && (
            <p className="text-red-700 text-sm">{errors.telefono.message}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white mt-6 py-2 rounded-lg font-semibold hover:bg-blue-700"
      >
        Guardar cambios
      </button>
    </form>
  );
};

export default FormProfile;
