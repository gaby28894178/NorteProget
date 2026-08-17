// src/components/admin/OrderDetail.jsx
import { LuArrowLeft, LuLoader } from "react-icons/lu";
import { getStatusMeta } from "../../utils/orderStatus";
import { OrderStatusSelect } from "./OrderStatusSelect";
import { OrderStatusTimeline } from "./OrderStatusTimeline";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 2,
});

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const shortId = (id) =>
  typeof id === "string" && id.length > 8 ? id.slice(0, 8) : id;

const mainImage = (item) =>
  item.product?.image_url ??
  (Array.isArray(item.product?.images) && item.product.images[0]?.secure_url) ??
  null;

const variantLabel = (item) => {
  const v = item.variant;
  if (!v) return "—";
  const parts = [v.size, v.color].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Única";
};

export const OrderDetail = ({
  order,
  updatingId,
  onStatusChange,
  onBack,
}) => {
  const isUpdating = String(order.id) === String(updatingId);
  const meta = getStatusMeta(order.status);
  const items = Array.isArray(order.items) ? order.items : [];
  const user = order.user ?? null;
  const payment = order.payment ?? null;

  const subtotal = (item) =>
    (Number(item.purchase_price) || 0) * (item.quantity || 0);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            title="Volver a la lista"
            aria-label="Volver a la lista de pedidos"
            className="p-2 rounded-md text-norte-dark hover:bg-norte-stone/40"
          >
            <LuArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-norte-dark">
              Pedido #{shortId(order.id)}
            </h1>
            <p className="text-sm text-gray-500 font-mono">{order.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-norte-dark bg-norte-stone/50 rounded-md hover:bg-norte-stone"
          >
            Volver a la lista
          </button>
          <div className="flex items-center gap-2">
            <OrderStatusSelect
              order={order}
              disabled={isUpdating}
              onChange={onStatusChange}
            />
            {isUpdating && (
              <LuLoader size={18} className="animate-spin text-norte-mustard" />
            )}
          </div>
        </div>
      </div>

      {/* Información del pedido + cliente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark border-b border-norte-stone/60 pb-2">
            Información del pedido
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Estado</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meta.badge}`}
              >
                {meta.label}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-extrabold text-norte-dark">
                {currencyFormatter.format(order.total_amount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Creado</p>
              <p className="text-sm text-gray-700">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Última actualización</p>
              <p className="text-sm text-gray-700">{formatDate(order.updated_at)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark border-b border-norte-stone/60 pb-2">
            Cliente
          </h3>
          {user ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Nombre</p>
                <p className="font-medium text-norte-dark">{user.full_name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm text-gray-700">{user.email}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              {order.user_id ? `ID de usuario: ${order.user_id}` : "Sin datos del cliente."}
            </p>
          )}
        </div>
      </div>

      {/* Productos del pedido */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-norte-stone/60">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark">
            Productos ({items.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b border-norte-stone/60">
              <tr>
                <th className="px-6 py-3">Producto</th>
                <th className="px-6 py-3">Variante</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3 text-right">Precio unitario</th>
                <th className="px-6 py-3 text-right">Cantidad</th>
                <th className="px-6 py-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-norte-stone/50">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Este pedido no tiene productos.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id ?? item.product_variant_id} className="hover:bg-norte-bg/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {mainImage(item) ? (
                          <img
                            src={mainImage(item)}
                            alt={item.product?.name ?? "Producto"}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-norte-stone/50 flex items-center justify-center text-norte-stone">
                            —
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-norte-dark">
                            {item.product?.name ?? "Producto"}
                          </div>
                          <div className="font-mono text-xs text-gray-400">
                            {item.product?.slug ?? ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{variantLabel(item)}</td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {item.variant?.sku ?? "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {currencyFormatter.format(item.purchase_price)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-norte-dark">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-norte-dark">
                      {currencyFormatter.format(subtotal(item))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-gray-50 border-t border-norte-stone/60">
              <tr>
                <td colSpan="5" className="px-6 py-3 text-right text-sm text-gray-500">
                  Total
                </td>
                <td className="px-6 py-3 text-right font-extrabold text-norte-dark">
                  {currencyFormatter.format(order.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Pago */}
      {payment && (
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark border-b border-norte-stone/60 pb-2">
            Pago
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Estado</p>
              <p className="font-medium text-norte-dark">{payment.status}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">ID de pago externo</p>
              <p className="font-mono text-xs text-gray-600">
                {payment.external_payment_id ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fecha</p>
              <p className="text-sm text-gray-700">{formatDate(payment.created_at)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Historial de cambios de estado */}
      <OrderStatusTimeline history={order.status_history} />
    </div>
  );
};