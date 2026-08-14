// Presentación compartida de los estados de pedido (labels y badges).
// Es solo de UI; la matriz de transiciones vive en api/ordersApi.js.
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
