// ============================================
// Google Analytics Data API (v1beta) — runReport
// Se consulta directo desde el browser con el token del admin
// (scope analytics.readonly). Sin server intermedio.
// ============================================

const PROPERTY_ID = import.meta.env.VITE_GA_PROPERTY_ID;

const ENDPOINT = (propertyId) =>
  `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;

/** Pasos del embudo de conversión en orden (evento GA4 → clave del modelo). */
export const FUNNEL_STEPS = [
  { event: "session_start", key: "visitas", label: "Visitas" },
  { event: "view_item_list", key: "catalogo", label: "Exploraron el catálogo" },
  { event: "view_item", key: "producto", label: "Vieron un producto" },
  { event: "add_to_cart", key: "carrito", label: "Agregaron al carrito" },
  { event: "begin_checkout", key: "checkout", label: "Iniciaron el checkout" },
  { event: "add_payment_info", key: "pago", label: "Iniciaron el pago" },
  { event: "purchase", key: "compra", label: "Compraron" },
];

const FUNNEL_EVENT_NAMES = FUNNEL_STEPS.map((step) => step.event);

const runReport = async ({ token, body }) => {
  if (!PROPERTY_ID) {
    throw new Error(
      "Falta VITE_GA_PROPERTY_ID en el entorno. Revisá frontend/.env.local",
    );
  }

  const response = await fetch(ENDPOINT(PROPERTY_ID), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`GA4 API ${response.status}: ${detail.slice(0, 200)}`);
  }

  return response.json();
};

const rowsToMap = (data) => {
  const map = {};

  (data.rows || []).forEach((row) => {
    const name = row.dimensionValues?.[0]?.value;
    const count = Number(row.metricValues?.[0]?.value || 0);

    if (name) map[name] = count;
  });

  return map;
};

/**
 * Trae el embudo de conversión + resumen de compras del período.
 * Devuelve el modelo normalizado que consume el dashboard.
 */
export const fetchGaMetrics = async ({ token, days = 30 }) => {
  const startDate = `${days}daysAgo`;
  const endDate = "today";

  // 1) Contador de eventos por paso del embudo.
  const [funnelReport, purchaseReport] = await Promise.all([
    runReport({
      token,
      body: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: { values: FUNNEL_EVENT_NAMES },
          },
        },
      },
    }),
    // 2) Detalle de compras: total e ingresos (suma del parámetro value).
    runReport({
      token,
      body: {
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: "eventName" }],
        metrics: [{ name: "eventCount" }, { name: "eventValue" }],
        dimensionFilter: {
          filter: {
            fieldName: "eventName",
            inListFilter: { values: ["purchase"] },
          },
        },
      },
    }),
  ]);

  const counts = rowsToMap(funnelReport);

  const funnel = Object.fromEntries(
    FUNNEL_STEPS.map((step) => [step.key, counts[step.event] || 0]),
  );

  const visitas = funnel.visitas;
  const compras = funnel.compra;
  const carrito = funnel.carrito;
  const ingresos = Number(purchaseReport.rows?.[0]?.metricValues?.[1]?.value || 0);

  return {
    periodDays: days,
    source: "ga4",
    funnel,
    summary: {
      visitas,
      compras,
      ingresos,
      ticketPromedio: compras > 0 ? ingresos / compras : 0,
      conversionRate: visitas > 0 ? (compras / visitas) * 100 : 0,
      carritoAbandonado: carrito > 0 ? 100 - (compras / carrito) * 100 : 0,
    },
  };
};