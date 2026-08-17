// src/components/admin/OrderStatusTimeline.jsx
import { getStatusMeta } from "../../utils/orderStatus";

const formatDate = (value) => {
  if (!value) return "—";
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const DOT_COLORS = {
  PENDING: "bg-norte-stone",
  PAID: "bg-norte-forest",
  PROCESSING: "bg-norte-mustard",
  COMPLETED: "bg-norte-forest",
  CANCELLED: "bg-red-500",
};

export const OrderStatusTimeline = ({ history = [] }) => {
  const sorted = [...history].sort(
    (a, b) => new Date(a.changed_at) - new Date(b.changed_at)
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark border-b border-norte-stone/60 pb-2">
        Historial de estado
      </h3>

      {sorted.length === 0 ? (
        <p className="text-sm text-gray-500">
          Sin cambios de estado registrados.
        </p>
      ) : (
        <ol className="relative border-l-2 border-norte-stone/50 ml-2">
          {sorted.map((entry, index) => {
            const isLast = index === sorted.length - 1;
            const meta = getStatusMeta(entry.to);
            const dotColor = DOT_COLORS[entry.to] ?? "bg-norte-stone";

            return (
              <li
                key={`${entry.changed_at}-${entry.to}`}
                className="relative pl-6 pb-5 last:pb-0"
              >
                <span
                  className={`absolute left-0 top-1.5 -translate-x-1/2 h-3 w-3 rounded-full ${dotColor} ${
                    isLast ? "ring-2 ring-norte-mustard/40" : ""
                  }`}
                  aria-hidden="true"
                />
                <div className="flex flex-wrap items-center gap-2">
                  {entry.from === null ? (
                    <span className="text-sm text-gray-500">
                      Pedido creado
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {getStatusMeta(entry.from).label} →{" "}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${meta.badge}`}
                  >
                    {meta.label}
                  </span>
                  {isLast && (
                    <span className="text-xs font-medium text-norte-mustard">
                      Estado actual
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-gray-400">
                  {formatDate(entry.changed_at)}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
