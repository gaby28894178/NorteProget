// src/pages/admin/AdminOrdersPage.jsx
import { useOrders } from "../../hooks/useOrders";
import { OrderTable } from "../../components/admin/OrderTable";
import { OrderDetail } from "../../components/admin/OrderDetail";
import { getStatusLabel } from "../../utils/orderStatus";

export const AdminOrdersPage = () => {
  const {
    orders,
    loading,
    error,
    updatingId,
    pendingChange,
    viewingOrder,
    handleStatusChange,
    handleConfirmChange,
    handleCancelChange,
    handleOpenView,
    handleCloseView,
  } = useOrders();

  // Resolvemos el pedido desde la lista más reciente para que el detalle
  // siempre refleje cambios de estado hechos desde la propia vista.
  const activeOrder = viewingOrder
    ? orders.find((o) => String(o.id) === String(viewingOrder.id)) ??
      viewingOrder
    : null;

  return (
    <div className="space-y-6">
      {activeOrder ? (
        <OrderDetail
          order={activeOrder}
          updatingId={updatingId}
          onStatusChange={handleStatusChange}
          onBack={handleCloseView}
        />
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold text-norte-dark">
              Gestión de Pedidos
            </h1>
            <p className="text-sm text-gray-500">
              Administrá el ciclo de vida de los pedidos actualizando su estado
            </p>
          </div>

          {error && (
            <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando pedidos...
            </div>
          ) : (
            <OrderTable
              orders={orders}
              updatingId={updatingId}
              onStatusChange={handleStatusChange}
              onView={handleOpenView}
            />
          )}
        </>
      )}

      {/* ============ CONFIRMACIÓN DE CAMBIO DE ESTADO ============ */}
      {pendingChange && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-norte-dark mb-2">
              Confirmar cambio de estado
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que querés marcar el pedido{" "}
              <strong className="text-norte-dark">
                #{pendingChange.order.id}
              </strong>{" "}
              como{" "}
              <strong className="text-norte-dark">
                {getStatusLabel(pendingChange.status)}
              </strong>
              ? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelChange}
                className="px-4 py-2 text-sm font-medium text-norte-dark bg-norte-stone/50 rounded-md hover:bg-norte-stone"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmChange}
                className={`px-4 py-2 text-sm font-medium text-white rounded-md hover:opacity-90 transition-opacity ${
                  pendingChange.status === "CANCELLED"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-norte-forest"
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};