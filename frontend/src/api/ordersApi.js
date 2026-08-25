import axiosInstance from "./axiosConfig";
import initialOrders from "../data/orders.json";
import { normalizeOrder, appendHistory, extractList, mockFilterAndSort } from "../utils/orderHelpers";

// Bandera para conmutar entre mock y API real
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;

export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "COMPLETED",
  "CANCELLED",
];

// Inicialización del estado en memoria
const seedFromJson = () =>
  Array.isArray(initialOrders)
    ? initialOrders.map((order) => normalizeOrder(order))
    : [];

let mockOrders = seedFromJson();

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Obtener listado de pedidos
 * Acepta: { page, limit, search, status, sortBy, sortOrder }
 * Retorna: { data: [...], pagination: { page, limit, total, totalPages } }
 */
export const getOrders = async ({
  page = 1,
  limit = 50,
  search = "",
  status = "",
  sortBy = "created_at",
  sortOrder = "desc",
} = {}) => {
  if (USE_MOCK) {
    await delay();
    return mockFilterAndSort(mockOrders, {
      page,
      limit,
      search,
      status,
      sortBy,
      sortOrder,
    });
  }
  const params = { page, limit, sortBy, sortOrder };
  if (search) params.search = search;
  if (status) params.status = status;
  const { data } = await axiosInstance.get("/orders", { params });
  return {
    data: extractList(data),
    pagination: data?.pagination ?? null,
  };
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

/**
 * Traduce un error al actualizar el estado de un pedido.
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

  const { data } = await axiosInstance.patch(`/orders/${id}/status`, {
    status,
  });
  return data;
};
