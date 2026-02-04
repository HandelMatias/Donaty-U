import * as yup from "yup";

export const registerSchema = yup.object({
  nombre: yup.string().trim().required("El nombre es obligatorio"),
  apellido: yup.string().trim().required("El apellido es obligatorio"),
  direccion: yup.string().trim().required("La dirección es obligatoria"),
  telefono: yup
    .string()
    .trim()
    .required("El teléfono es obligatorio")
    .matches(/^[0-9]{6,15}$/, "Teléfono inválido"),
  email: yup
    .string()
    .trim()
    .email("Correo inválido")
    .required("El correo es obligatorio"),
  password: yup
    .string()
    .min(6, "Mínimo 6 caracteres")
    .required("La contraseña es obligatoria"),
});
