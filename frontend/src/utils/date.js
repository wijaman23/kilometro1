/**
 * Formatea una fecha a dd/mm/yyyy (ej: 11/01/2026)
 */
export const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};