// src/components/admin/OrderStatusSelect.jsx
import { getNextStatuses, getStatusLabel } from "../../utils/orderStatus";

export const OrderStatusSelect = ({ order, disabled = false, onChange }) => {
  const nextStatuses = getNextStatuses(order.status);
  const options =
    nextStatuses.length === 0 ? [order.status] : [order.status, ...nextStatuses];

  return (
    <select
      value={order.status}
      disabled={disabled}
      onChange={(e) => onChange(order, e.target.value)}
      aria-label={`Cambiar estado del pedido ${order.id}`}
      className="px-2 py-1.5 text-sm text-norte-dark bg-white border border-norte-stone rounded-md disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-norte-mustard/50"
    >
      {options.map((status) => (
        <option key={status} value={status}>
          {getStatusLabel(status)}
        </option>
      ))}
    </select>
  );
};