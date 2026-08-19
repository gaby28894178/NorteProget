// ============================================
// Google Identity Services (GIS) — Login OAuth
// Flujo token (implicit) 100% client-side.
// El Client ID es público por diseño (no es un secreto).
// ============================================

const CLIENT_ID = import.meta.env.VITE_GA_CLIENT_ID;

const SCOPES = "https://www.googleapis.com/auth/analytics.readonly";

const TOKEN_KEY = "norte-ga-token";

let gsiPromise = null;

/**
 * Carga el SDK de Google Identity Services una sola vez.
 * Se inyecta bajo demanda para no penalizar el resto de la app.
 */
const loadGsi = () => {
  if (typeof window !== "undefined" && window.google?.accounts?.oauth2) {
    return Promise.resolve();
  }

  if (gsiPromise) return gsiPromise;

  gsiPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gsiPromise = null;
      reject(new Error("No se pudo cargar Google Identity Services."));
    };
    document.head.appendChild(script);
  });

  return gsiPromise;
};

/**
 * Inicia el flujo interactivo de autorización con la cuenta del admin.
 * Al terminar guarda el token de acceso en sessionStorage (memoria por pestaña)
 * e invoca `onSuccess(token)`.
 */
export const requestGoogleAuth = async ({ onSuccess, onError } = {}) => {
  if (!CLIENT_ID) {
    onError?.(
      new Error(
        "Falta VITE_GA_CLIENT_ID en el entorno. Revisá frontend/.env.local",
      ),
    );
    return;
  }

  try {
    await loadGsi();

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        if (!response?.access_token) {
          onError?.(new Error("No se recibió token de acceso."));
          return;
        }

        const expiresAt =
          Date.now() + (Number(response.expires_in || 3600) - 60) * 1000;

        sessionStorage.setItem(
          TOKEN_KEY,
          JSON.stringify({ token: response.access_token, expiresAt }),
        );

        onSuccess?.(response.access_token);
      },
      error_callback: (error) => {
        console.error("[analytics] Error de autorización:", error);
        onError?.(new Error(error?.message || "Autorización rechazada."));
      },
    });

    tokenClient.requestAccessToken();
  } catch (error) {
    console.error("[analytics] No se pudo iniciar OAuth:", error);
    onError?.(error);
  }
};

/** Devuelve el token vigente (si existe y no expiró), o null. */
export const getAccessToken = () => {
  try {
    const raw = sessionStorage.getItem(TOKEN_KEY);

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    if (!parsed?.token) return null;

    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      clearGoogleAuth();
      return null;
    }

    return parsed.token;
  } catch {
    return null;
  }
};

export const isGoogleConnected = () => Boolean(getAccessToken());

export const clearGoogleAuth = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};