import axiosInstance from "./axiosConfig";

// Usa credenciales mock en el frontend mientras no exista el backend de auth.
// El único punto donde se decide entre mock y API real es este flag.
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;

// Credenciales demo del panel admin (solo válidas en modo mock).
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Token JWT simulado: conserva el mismo formato y almacenamiento que el del
// backend real, para que al conectar la API solo cambie esta capa (mock → REST).
const createMockToken = (email) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: email,
      role: "ADMIN",
      iat: Math.floor(Date.now() / 1000),
    }),
  );
  return `${header}.${payload}.mock-signature`;
};

// Normaliza la respuesta del endpoint real (puede llegar como { token, user }
// o envuelta en { data: { token, user } }).
const normalizeAuthResponse = (data) => ({
  token: data?.token,
  user: data?.user ?? { email: data?.email },
});

/**
 * Login del panel admin.
 * Mock: valida contra VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD.
 * Real: POST /auth/login → { token, user }.
 */
export const adminLogin = async ({ email, password }) => {
  if (USE_MOCK) {
    await delay();

    const emailMatches =
      ADMIN_EMAIL &&
      email?.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();

    const passwordMatches = ADMIN_PASSWORD && password === ADMIN_PASSWORD;

    if (!emailMatches || !passwordMatches) {
      const error = new Error(
        "Credenciales inválidas. Revisá el email y la contraseña.",
      );
      error.status = 401;
      throw error;
    }

    return {
      token: createMockToken(email.trim()),
      user: {
        email: email.trim(),
        full_name: "NORTE Admin",
        role: "ADMIN",
      },
    };
  }

  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return normalizeAuthResponse(data?.data ?? data);
};