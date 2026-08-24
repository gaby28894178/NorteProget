/**
 * Extrae el mensaje de error de una respuesta del backend.
 * Estructura esperada: { error: "mensaje" } o { error, errors: [...] }
 */
export const getApiErrorMessage = (error, fallback = "Ocurrió un error inesperado.") => {
  const message = error?.response?.data?.error;
  return typeof message === "string" && message.trim() ? message.trim() : fallback;
};

/**
 * Extrae errores de validación detallados (array de { field, message }).
 */
export const getApiValidationErrors = (error) => {
  const errors = error?.response?.data?.errors;
  return Array.isArray(errors) ? errors : [];
};

/**
 * Devuelve el código HTTP de un error deAxios, o 0 si no existe.
 */
export const getHttpStatus = (error) => error?.response?.status ?? 0;
