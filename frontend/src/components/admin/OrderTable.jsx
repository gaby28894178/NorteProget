// src/components/admin/OrderTable.jsx
import { LuEye, LuLoader, LuArrowUp, LuArrowDown } from "react-icons/lu";
import { getStatusMeta } from "../../utils/orderStatus";
import { OrderStatusSelect } from "./OrderStatusSelect";

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

const SortIcon = ({ field, sortBy, sortOrder, hint }) => {
  const isActive = sortBy === field;
  return (
    <span className="inline-flex items-center ml-2 gap-1">
      {hint && (
        <span className={`text-[10px] font-medium ${isActive ? "text-norte-mustard" : "text-gray-400"}`}>
          {hint}
        </span>
      )}
      {isActive ? (
        sortOrder === "asc" ? (
          <LuArrowUp size={16} strokeWidth={2.5} className="text-norte-mustard" />
        ) : (
          <LuArrowDown size={16} strokeWidth={2.5} className="text-norte-mustard" />
        )
      ) : (
        <LuArrowUp size={16} strokeWidth={2} className="text-gray-300" />
      )}
    </span>
  );
};

const SortableHeader = ({ field, label, hint, sortBy, sortOrder, onSort }) => (
  <th
    className="px-6 py-3 cursor-pointer select-none hover:bg-gray-100 transition-colors"
    onClick={() => onSort(field)}
  >
    <span className="inline-flex items-center">
      {label}
      <SortIcon field={field} sortBy={sortBy} sortOrder={sortOrder} hint={hint} />
    </span>
  </th>
);

export const OrderTable = ({
  orders,
  updatingId,
  onStatusChange,
  onView,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const shortId = (id) =>
    typeof id === "string" && id.length > 8 ? id.slice(0, 8) : id;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full min-w-max text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b border-norte-stone/60">
          <tr>
            <th className="px-6 py-3">Pedido</th>
            {onSort ? (
              <SortableHeader
                field="customer"
                label="Cliente"
                hint="A-Z"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
            ) : (
              <th className="px-6 py-3">Cliente</th>
            )}
            {onSort ? (
              <SortableHeader
                field="total_amount"
                label="Total"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
            ) : (
              <th className="px-6 py-3">Total</th>
            )}
            {onSort ? (
              <SortableHeader
                field="created_at"
                label="Fecha"
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSort={onSort}
              />
            ) : (
              <th className="px-6 py-3">Fecha</th>
            )}
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3">Cambiar estado</th>
            <th className="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-norte-stone/50">
          {orders.length === 0 ? (
            <tr>
              <td
                colSpan="7"
                className="px-6 py-4 text-center text-gray-500"
              >
                No hay pedidos que coincidan con los filtros.
              </td>
            </tr>
          ) : (
            orders.map((order) => {
              const isUpdating = String(order.id) === String(updatingId);
              const meta = getStatusMeta(order.status);
              const customerName =
                order.user?.full_name ?? order.user_id ?? "—";

              return (
                <tr
                  key={order.id}
                  onClick={() => onView?.(order)}
                  className={`hover:bg-norte-bg/50 ${onView ? "cursor-pointer" : ""}`}
                  title={
                    onView
                      ? `Ver detalle del pedido #${shortId(order.id)}`
                      : undefined
                  }
                >
                  <td className="px-6 py-4 font-mono text-xs text-norte-dark">
                    #{shortId(order.id)}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-norte-dark">
                        {customerName}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.user?.email ?? ""}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-norte-dark whitespace-nowrap">
                    {currencyFormatter.format(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(order.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meta.badge}`}
                    >
                      {meta.label}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <OrderStatusSelect
                        order={order}
                        disabled={isUpdating}
                        onChange={onStatusChange}
                      />
                      {isUpdating && (
                        <LuLoader
                          size={18}
                          className="animate-spin text-norte-mustard"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {onView && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(order);
                        }}
                        title="Ver detalle"
                        aria-label={`Ver detalle del pedido #${shortId(order.id)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-norte-mustard hover:bg-norte-mustard/10"
                      >
                        <LuEye size={18} />
                        <span className="hidden sm:inline text-sm font-medium">
                          Ver pedido
                        </span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
