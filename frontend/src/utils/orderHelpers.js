// Utilidades compartidas para el módulo de pedidos.
// Normalización, historial, extracción de listas y filtrado mock.

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ?? `mock-ord-${Date.now()}`;

const toISO = (value) => value || new Date().toISOString();

/** Normaliza un payload de pedido al formato que usa el frontend. */
export const normalizeOrder = (data) => {
  const now = new Date().toISOString();
  return {
    id: data.id ?? generateId(),
    user_id: data.user_id,
    status: data.status || "PENDING",
    total_amount: Number(data.total_amount) || 0,
    created_at: toISO(data.created_at || now),
    updated_at: toISO(data.updated_at || now),
    user: data.user ?? null,
    items: Array.isArray(data.items) ? data.items : [],
    payment: data.payment ?? null,
    status_history: Array.isArray(data.status_history)
      ? data.status_history
      : [],
  };
};

/** Agrega un registro al historial de cambios de estado. */
export const appendHistory = (order, from, to, changedAt) => {
  const history = Array.isArray(order.status_history)
    ? order.status_history
    : [];
  return [...history, { from, to, changed_at: changedAt }];
};

/** Extrae la lista de datos de la respuesta del backend. */
export const extractList = (data) =>
  Array.isArray(data) ? data : (data?.data ?? data?.rows ?? []);

/** Normaliza un texto para búsqueda (sin acentos, minúsculas). */
const normalizeText = (text) =>
  (text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/**
 * Filtra y ordena pedidos en modo mock.
 * Simula lo que el backend haría con query params.
 */
export const mockFilterAndSort = (
  list,
  {
    page = 1,
    limit = 50,
    search = "",
    status,
    sortBy = "created_at",
    sortOrder = "desc",
  } = {},
) => {
  let filtered = [...list];

  // Filtro por búsqueda (nombre o email del usuario)
  if (search) {
    const term = normalizeText(search);
    filtered = filtered.filter((order) => {
      const name = normalizeText(order.user?.full_name);
      const email = (order.user?.email ?? "").toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }

  // Filtro por estado
  if (status) {
    filtered = filtered.filter((order) => order.status === status);
  }

  // Ordenamiento
  const dir = sortOrder === "asc" ? 1 : -1;
  filtered.sort((a, b) => {
    let valA, valB;
    if (sortBy === "total_amount") {
      valA = Number(a.total_amount) || 0;
      valB = Number(b.total_amount) || 0;
    } else if (sortBy === "created_at") {
      valA = new Date(a.created_at).getTime();
      valB = new Date(b.created_at).getTime();
    } else if (sortBy === "customer") {
      valA = normalizeText(a.user?.full_name);
      valB = normalizeText(b.user?.full_name);
      return valA.localeCompare(valB) * dir;
    } else {
      valA = a[sortBy] ?? "";
      valB = b[sortBy] ?? "";
    }
    return (valA - valB) * dir;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    pagination: { page, limit, total, totalPages },
  };
};
