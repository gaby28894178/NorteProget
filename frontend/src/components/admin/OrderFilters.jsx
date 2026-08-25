import { LuSearch, LuX } from "react-icons/lu";
import { ORDER_STATUSES } from "../../api/ordersApi";
import { getStatusMeta } from "../../utils/orderStatus";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  ...ORDER_STATUSES.map((s) => ({
    value: s,
    label: getStatusMeta(s).label,
  })),
];

export const OrderFilters = ({
  searchInput,
  onSearchChange,
  statusFilter,
  onStatusChange,
  resultCount,
  totalCount,
  hasActiveFilters,
  onClearFilters,
}) => {
  return (
    <div className="space-y-3">
      {/* Barra de búsqueda + contador */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <LuSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-norte-stone/60 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-norte-mustard/40 focus:border-norte-mustard"
          />
          {searchInput && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Limpiar búsqueda"
            >
              <LuX size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-norte-mustard hover:text-norte-forest font-medium transition-colors"
            >
              Limpiar filtros
            </button>
          )}
          <span>
            {resultCount} de {totalCount} pedidos
          </span>
        </div>
      </div>

      {/* Pills de estado */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((opt) => {
          const isActive =
            opt.value === statusFilter ||
            (opt.value === "" && !statusFilter);
          const meta = opt.value ? getStatusMeta(opt.value) : null;

          return (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                isActive
                  ? opt.value === ""
                    ? "bg-norte-dark text-white border-norte-dark"
                    : `${meta.badge} border-transparent`
                  : "bg-white text-gray-600 border-norte-stone/40 hover:border-norte-stone"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
