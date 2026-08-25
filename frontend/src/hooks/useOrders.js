import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getOrders,
  updateOrderStatus,
  getOrderErrorMessage,
} from "../api/ordersApi";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  // True solo en la carga inicial (sin datos aún)
  const [initialLoading, setInitialLoading] = useState(true);

  // Pedido cuyo estado se está actualizando (para deshabilitar su fila)
  const [updatingId, setUpdatingId] = useState(null);

  // Cambio que requiere confirmación (COMPLETED / CANCELLED):
  // guarda el pedido y el estado objetivo hasta que el admin confirme.
  const [pendingChange, setPendingChange] = useState(null);

  // Pedido abierto en la vista de detalle.
  const [viewingOrder, setViewingOrder] = useState(null);

  // ─── Estados de filtros ─────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Forzar recarga sin cambiar filtros
  const [refreshKey, setRefreshKey] = useState(0);
  const refetch = () => setRefreshKey((k) => k + 1);

  // Debounce de búsqueda (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Carga de datos cuando cambian filtros, paginación o refresh
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await getOrders({
          search,
          status: statusFilter,
          sortBy,
          sortOrder,
        });
        if (isMounted) {
          setOrders(result.data);
          setPagination(result.pagination);
          setError(null);
          setInitialLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error al cargar pedidos:", err);
          setError("No se pudieron cargar los pedidos.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [search, statusFilter, sortBy, sortOrder, refreshKey]);

  // Ejecuta efectivamente el cambio de estado y refleja el resultado.
  const applyStatus = async (order, status) => {
    const previous = order.status;

    setUpdatingId(order.id);
    setError(null);
    try {
      const updated = await updateOrderStatus(order.id, status);
      // Reflejar de inmediato usando la orden devuelta por la API/mock.
      setOrders((orders) =>
        orders.map((o) =>
          String(o.id) === String(order.id) ? updated : o,
        ),
      );
      toast.success("Estado del pedido actualizado correctamente.");
    } catch (err) {
      console.error("Error al actualizar el estado del pedido:", err);
      // Si falla, volvemos al estado anterior para que no quede inconsistencia.
      setOrders((orders) =>
        orders.map((o) =>
          String(o.id) === String(order.id) ? { ...o, status: previous } : o,
        ),
      );
      toast.error(getOrderErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  // Punto de entrada desde el select de la fila.
  // Los cambios a estados terminales (COMPLETED / CANCELLED) piden
  // confirmación antes de aplicarse; el resto se aplica directo.
  const handleStatusChange = (order, status) => {
    if (status === order.status) return;
    if (status === "COMPLETED" || status === "CANCELLED") {
      setPendingChange({ order, status });
      return;
    }
    applyStatus(order, status);
  };

  const handleConfirmChange = () => {
    if (!pendingChange) return;
    applyStatus(pendingChange.order, pendingChange.status);
    setPendingChange(null);
  };

  const handleCancelChange = () => {
    setPendingChange(null);
  };

  const handleOpenView = (order) => {
    setViewingOrder(order);
  };

  const handleCloseView = () => {
    setViewingOrder(null);
  };

  // ─── Sort ───────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder(field === "created_at" ? "desc" : "asc");
    }
  };

  // ─── Limpiar filtros ───────────────────────────────────
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  const hasActiveFilters = search || statusFilter;

  return {
    orders,
    loading,
    initialLoading,
    error,
    pagination,
    updatingId,
    pendingChange,
    viewingOrder,
    // Filtros
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    handleSort,
    hasActiveFilters,
    clearFilters,
    // Acciones
    fetchOrders: refetch,
    handleStatusChange,
    handleConfirmChange,
    handleCancelChange,
    handleOpenView,
    handleCloseView,
  };
};
