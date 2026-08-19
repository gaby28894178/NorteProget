// ============================================
// Datos de demostración para el dashboard de métricas.
// Se usan cuando no hay token de GA4 (o la API falla).
// Deterministas por día: los números son estables durante el
// día pero cambian de un día a otro.
// ============================================

const scaleByDays = (base, days) => base * (days / 30);

const hashSeed = (input) => {
  let hash = 2166136261;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const mulberry32 = (seed) => {
  let state = seed;

  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;

    let t = Math.imul(state ^ (state >>> 15), 1 | state);

    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const round = (value, digits = 0) => {
  const factor = 10 ** digits;

  return Math.round(value * factor) / factor;
};

/**
 * Genera un embudo de conversión plausible para `days` días.
 * Devuelve el mismo modelo normalizado que consume `fetchGaMetrics`.
 */
export const buildDemoMetrics = (days = 30) => {
  const today = new Date();
  const seed = hashSeed(`norte-${today.toDateString()}-${days}`);
  const rand = mulberry32(seed);

  const visitas = Math.round(scaleByDays(2400, days) * (0.85 + rand() * 0.3));
  const catalogo = Math.round(visitas * (0.62 + rand() * 0.12));
  const producto = Math.round(catalogo * (0.6 + rand() * 0.1));
  const carrito = Math.round(producto * (0.42 + rand() * 0.08));
  const checkout = Math.round(carrito * (0.5 + rand() * 0.08));
  const pago = Math.round(checkout * (0.78 + rand() * 0.08));
  const compra = Math.round(pago * (0.88 + rand() * 0.06));

  const ticketPromedio = 32000 + rand() * 9000;
  const ingresos = compra * ticketPromedio;

  const funnel = {
    visitas,
    catalogo,
    producto,
    carrito,
    checkout,
    pago,
    compra,
  };

  return {
    periodDays: days,
    source: "demo",
    funnel,
    summary: {
      visitas,
      compras: compra,
      ingresos: round(ingresos, 2),
      ticketPromedio: round(compra > 0 ? ingresos / compra : 0, 2),
      conversionRate: round(visitas > 0 ? (compra / visitas) * 100 : 0, 1),
      carritoAbandonado: round(
        carrito > 0 ? 100 - (compra / carrito) * 100 : 0,
        1,
      ),
    },
  };
};