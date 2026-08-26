import axiosInstance from "./axiosConfig";

// TODO(limpiar): Eliminar USE_MOCK, ADMIN_EMAIL, ADMIN_PASSWORD,
// createMockToken y el bloque if (USE_MOCK) completo.
// Solo quedará la llamada axios real a POST /auth/login.
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;

// TODO(limpiar): Eliminar credenciales demo (solo válidas en mock)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

// TODO(limpiar): Eliminar delay
const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO(limpiar): Eliminar createMockToken
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
  token: data?.token ?? data?.accessToken,
  refreshToken: data?.refreshToken,
  user: data?.user ?? { email: data?.email },
});

export const clientLogin = async ({ email, password }) => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return normalizeAuthResponse(data?.data ?? data);
};

/**
 * Login del panel admin.
 * Mock: valida contra VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD.
 * Real: POST /auth/login → { token, user }.
 */
export const adminLogin = async ({ email, password }) => {
  // TODO(limpiar): Eliminar bloque if (USE_MOCK) completo
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
