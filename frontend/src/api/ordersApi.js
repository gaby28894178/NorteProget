import axiosInstance from "./axiosConfig";
import initialOrders from "../data/orders.json";

// Bandera para conmutar entre mock y API real
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ?? `mock-ord-${Date.now()}`;

const toISO = (value) => value || new Date().toISOString();

export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
];

/*
 * Matriz de transiciones permitidas del ciclo de vida del pedido.
 * Desde \ Hacia	PENDING	 PAID	  PROCESSING   COMPLETED	CANCELLED
 * PENDING	  		    —      ✔		  ✔	 	        ✔			✔
 * PAID				    ✘	   —		  ✔		        ✔			✔
 * PROCESSING		    ✘	   ✘		  —		        ✔			✔
 * COMPLETED		    ✘	   ✘		  ✘		        —			✘
 * CANCELLED		    ✘	   ✘		  ✘		         ✘			—
 *
 * Se asume CANCELLED y COMPLETED como estado final, y no se permite volver a un estado anterior.
 *
 */

const ALLOWED_TRANSITIONS = {
  PENDING: ["PAID", "PROCESSING", "COMPLETED", "CANCELLED"],
  PAID: ["PROCESSING", "COMPLETED", "CANCELLED"],
  PROCESSING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

/**
 * Devuelve los estados a los que se puede pasar desde `status`.
 */
export const getNextStatuses = (status) => ALLOWED_TRANSITIONS[status] ?? [];

/**
 * Indica si la transición de `current` a `next` está permitida.
 */
export const canTransition = (current, next) =>
  ALLOWED_TRANSITIONS[current]?.includes(next) ?? false;

// Normalización de la orden.
// Respeta el nested payload típico que devolverá el backend con includes:
// user (cliente), items (con variant + product), payment y status_history.
const normalizeOrder = (data) => {
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

// Agrega un registro al historial de cambios de estado.
const appendHistory = (order, from, to, changedAt) => {
  const history = Array.isArray(order.status_history)
    ? order.status_history
    : [];
  return [...history, { from, to, changed_at: changedAt }];
};

const extractList = (data) =>
  Array.isArray(data) ? data : (data?.data ?? data?.rows ?? []);

// Inicialización del estado en memoria
const seedFromJson = () =>
  Array.isArray(initialOrders)
    ? initialOrders.map((order) => normalizeOrder(order))
    : [];

let mockOrders = seedFromJson();

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Obtener listado de pedidos
 */
export const getOrders = async () => {
  if (USE_MOCK) {
    await delay();
    return [...mockOrders];
  }
  const { data } = await axiosInstance.get("/orders");
  return extractList(data);
};

/**
 * Obtener un pedido por ID
 */
export const getOrderById = async (id) => {
  if (USE_MOCK) {
    await delay();
    const order = mockOrders.find((o) => String(o.id) === String(id));
    if (!order) throw new Error("Pedido no encontrado");
    return { ...order };
  }
  const { data } = await axiosInstance.get(`/orders/${id}`);
  return data;
};

/*
 * Traduce un error al actualizar el estado de un pedido a un mensaje
 * amigable para el usuario.
 *
 * - err.response existe cuando el servidor respondió (errores HTTP 4xx/5xx):
 *   usamos un mensaje genérico (ajustable más adelante según disponga backend).
 * - err.code / err.message sin response: fallo antes de llegar al servidor
 *   (red caída, timeout, DNS), por lo que mostramos un mensaje de conexión.
 * - Por defecto (mock): mensaje genérico.
 */
export const getOrderErrorMessage = (err) => {
  const hasResponse = Boolean(err?.response);
  if (!hasResponse) {
    return "Error de conexión. No se pudo actualizar el pedido. Verificá tu conexión e intentá de nuevo.";
  }
  return "No se pudo actualizar el estado del pedido.";
};

/**
 * Actualizar el estado de un pedido
 */
export const updateOrderStatus = async (id, status) => {
  if (USE_MOCK) {
    await delay();

    if (!ORDER_STATUSES.includes(status)) {
      throw new Error(`Estado '${status}' no es válido.`);
    }

    let updatedOrder = null;
    mockOrders = mockOrders.map((order) => {
      if (String(order.id) !== String(id)) return order;
      const changedAt = new Date().toISOString();
      updatedOrder = normalizeOrder({
        ...order,
        status,
        updated_at: changedAt,
        status_history: appendHistory(order, order.status, status, changedAt),
      });
      return updatedOrder;
    });

    if (!updatedOrder) {
      throw new Error("Pedido no encontrado para actualizar.");
    }

    return updatedOrder;
  }

  // queda listo para la API real cuando tengamos los endpoints implementados
  const { data } = await axiosInstance.patch(`/orders/${id}/status`, {
    status,
  });
  return data;
};
