import * as yup from "yup";

export const donationSchema = yup.object({
  tipo: yup.string().oneOf(["fisica", "dinero"]).required("El tipo es obligatorio"),
  categoria: yup.string().trim().max(120, "Máx 120 caracteres"),
  descripcion: yup
    .string()
    .trim()
    .required("La descripción es obligatoria")
    .min(3, "Mínimo 3 caracteres"),
  moneda: yup.string().trim().max(10),
  montoUsd: yup
    .number()
    .typeError("Monto inválido")
    .when("tipo", {
      is: "dinero",
      then: (s) => s.positive("Debe ser mayor a 0").required("El monto es requerido"),
      otherwise: (s) => s.notRequired(),
    }),
  metodoPago: yup.string().when("tipo", {
    is: "dinero",
    then: (s) => s.oneOf(["stripe", "transferencia", "efectivo"]).required(),
    otherwise: (s) => s.notRequired(),
  }),
  direccionEntrega: yup.string().when("tipo", {
    is: "fisica",
    then: (s) => s.trim().required("La dirección es obligatoria"),
    otherwise: (s) => s.notRequired(),
  }),
  telefonoContacto: yup.string().when("tipo", {
    is: "fisica",
    then: (s) => s.trim().required("El teléfono es obligatorio"),
    otherwise: (s) => s.notRequired(),
  }),
});
