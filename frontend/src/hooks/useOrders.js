import { useState, useEffect, useCallback } from "react";
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

  // Pedido cuyo estado se está actualizando (para deshabilitar su fila)
  const [updatingId, setUpdatingId] = useState(null);

  // Cambio que requiere confirmación (COMPLETED / CANCELLED):
  // guarda el pedido y el estado objetivo hasta que el admin confirme.
  const [pendingChange, setPendingChange] = useState(null);

  // Pedido abierto en la vista de detalle.
  const [viewingOrder, setViewingOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error al cargar pedidos:", err);
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial en el montaje (setState solo en callbacks asíncronos)
  useEffect(() => {
    let isMounted = true;

    getOrders()
      .then((data) => {
        if (isMounted) {
          setOrders(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error al cargar pedidos:", err);
          setError("No se pudieron cargar los pedidos.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Ejecuta efectivamente el cambio de estado y refleja el resultado.
  const applyStatus = async (order, status) => {
    const previous = order.status;

    setUpdatingId(order.id);
    setError(null);
    try {
      const updated = await updateOrderStatus(order.id, status);
      // Reflejar de inmediato usando la orden devuelta por la API/mock.
      setOrders((orders) =>
        orders.map((o) => String(o.id) === String(order.id) ? updated : o)
      );
      toast.success("Estado del pedido actualizado correctamente.");
    } catch (err) {
      console.error("Error al actualizar el estado del pedido:", err);
      // Si falla, volvemos al estado anterior para que no quede inconsistencia.
      setOrders((orders) =>
        orders.map((o) =>
          String(o.id) === String(order.id) ? { ...o, status: previous } : o
        )
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

  return {
    orders,
    loading,
    error,
    updatingId,
    pendingChange,
    viewingOrder,
    fetchOrders,
    handleStatusChange,
    handleConfirmChange,
    handleCancelChange,
    handleOpenView,
    handleCloseView,
  };
};
