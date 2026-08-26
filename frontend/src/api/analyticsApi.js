// ============================================
// API de métricas — único punto de acceso del dashboard.
// Intenta GA4 real (token del admin).
// Muestra datos demo si no se ha logueado o si GA4 no está disponible.
// TODO(limpiar): Considerar eliminar el fallback a demo si no se necesita.
// ============================================

import { getAccessToken } from "../utils/googleAuth";
import { fetchGaMetrics } from "../utils/gaData";
import { buildDemoMetrics } from "../data/analyticsDemo";

export const getAnalyticsMetrics = async ({ days = 30, token } = {}) => {
  const accessToken = token ?? getAccessToken();

  if (accessToken) {
    try {
      return await fetchGaMetrics({ token: accessToken, days });
    } catch (error) {
      console.warn(
        "[analytics] GA4 no disponible, usando datos demo:",
        error.message,
      );
    }
  }

  return buildDemoMetrics(days);
};

export const getAnalyticsSource = () => (getAccessToken() ? "ga4" : "demo");
