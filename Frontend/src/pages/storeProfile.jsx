// src/pages/storeProfile.js
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const getAuthHeaders = () => {
  const token = localStorage.getItem("donatyToken");
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const storeProfile = create((set) => ({
  user: null,

  clearUser: () => set({ user: null }),

  // Obtener perfil /perfil
  profile: async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/perfil`;
      const respuesta = await axios.get(url, getAuthHeaders());
      set({ user: respuesta.data });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.msg || "Error al obtener el perfil del donante"
      );
    }
  },

  // Actualizar datos del perfil /actualizarperfil/:id
  updateProfile: async (url, data) => {
    try {
      const respuesta = await axios.put(url, data, getAuthHeaders());
      // Actualizamos el user en el store
      set({ user: respuesta.data });
      toast.success(
        respuesta.data?.msg || "Perfil actualizado correctamente"
      );
      return respuesta;
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.msg || "Error al actualizar el perfil"
      );
    }
  },

  // Actualizar contraseña /actualizarpassword/:id
  updatePasswordProfile: async (url, data) => {
    try {
      const respuesta = await axios.put(url, data, getAuthHeaders());
      toast.success(
        respuesta.data?.msg || "Contraseña actualizada correctamente"
      );
      return respuesta;
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.msg || "Error al actualizar la contraseña"
      );
    }
  },
}));

export default storeProfile;
