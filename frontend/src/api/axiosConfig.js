import axios from "axios";

// TODO(limpiar): Eliminar el fallback a localhost. Exigir VITE_API_URL explícita.
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor para adjuntar Token JWT en ruta privada (ADMIN)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de respuesta: maneja 401 (token expirado / inválido)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("norte-admin-user");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
