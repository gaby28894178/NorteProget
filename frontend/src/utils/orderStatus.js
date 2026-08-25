// Presentación y ciclo de vida de los estados de pedido.
// Labels/badges para UI + matriz de transiciones permitidas.

export const ORDER_STATUS_META = {
  PENDING: { label: "Pendiente", badge: "bg-norte-stone/40 text-norte-dark" },
  PAID: { label: "Pagado", badge: "bg-norte-forest/10 text-norte-forest" },
  PROCESSING: {
    label: "En proceso",
    badge: "bg-norte-mustard/10 text-norte-mustard",
  },
  COMPLETED: {
    label: "Completado",
    badge: "bg-norte-forest/10 text-norte-forest",
  },
  CANCELLED: { label: "Cancelado", badge: "bg-red-50 text-red-600" },
};

export const getStatusMeta = (status) =>
  ORDER_STATUS_META[status] ?? {
    label: status,
    badge: "bg-norte-stone/40 text-norte-dark",
  };

export const getStatusLabel = (status) => getStatusMeta(status).label;

// ─── Matriz de transiciones del ciclo de vida ──────────────
// PENDING -> PAID, PROCESSING, COMPLETED, CANCELLED
// PAID    -> PROCESSING, COMPLETED, CANCELLED
// PROCESSING -> COMPLETED, CANCELLED
// COMPLETED  -> (terminal)
// CANCELLED  -> (terminal)

const ALLOWED_TRANSITIONS = {
  PENDING: ["PAID", "PROCESSING", "COMPLETED", "CANCELLED"],
  PAID: ["PROCESSING", "COMPLETED", "CANCELLED"],
  PROCESSING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

/** Devuelve los estados a los que se puede pasar desde `status`. */
export const getNextStatuses = (status) =>
  ALLOWED_TRANSITIONS[status] ?? [];

/** Indica si la transición de `current` a `next` está permitida. */
export const canTransition = (current, next) =>
  ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;
