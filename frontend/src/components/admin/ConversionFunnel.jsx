const STEPS = [
  { key: "visitas", label: "Visitas" },
  { key: "catalogo", label: "Exploraron el catálogo" },
  { key: "producto", label: "Vieron un producto" },
  { key: "carrito", label: "Agregaron al carrito" },
  { key: "checkout", label: "Iniciaron el checkout" },
  { key: "pago", label: "Iniciaron el pago" },
  { key: "compra", label: "Compraron" },
];

const BAR_COLORS = [
  "bg-norte-stone",
  "bg-mostaza-3",
  "bg-mostaza-5",
  "bg-mostaza-6",
  "bg-mostaza-7",
  "bg-norte-forest-3",
  "bg-norte-forest",
];

const formatCount = (value) =>
  new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(value);

const formatPercent = (value) =>
  `${new Intl.NumberFormat("es-AR", { maximumFractionDigits: 1 }).format(
    value,
  )}%`;

export const ConversionFunnel = ({ funnel }) => {
  const maxCount = Math.max(
    1,
    ...STEPS.map((step) => Number(funnel?.[step.key] || 0)),
  );

  return (
    <div className="space-y-4">
      {STEPS.map((step, index) => {
        const count = Number(funnel?.[step.key] || 0);
        const prev =
          index === 0 ? count : Number(funnel?.[STEPS[index - 1].key] || 0);

        const stepToStep =
          index === 0 ? 100 : prev > 0 ? (count / prev) * 100 : 0;

        const cumulative =
          index === 0
            ? 100
            : count > 0
              ? ((count / (funnel?.visitas || count)) * 100).toFixed(1)
              : "0";

        return (
          <div key={step.key} className="group">
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-medium text-norte-dark">
                  {step.label}
                </span>
                <span className="text-xs text-gray-400">
                  {index === 0
                    ? ""
                    : `+${formatPercent(stepToStep)} vs anterior`}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-norte-dark">
                  {formatCount(count)}
                </span>
                {index > 0 && (
                  <span className="ml-2 text-xs text-gray-400">
                    {cumulative}% del total
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 rounded-full bg-norte-bg overflow-hidden">
                <div
                  className={`h-full rounded-full ${BAR_COLORS[index]} transition-all duration-500`}
                  style={{ width: `${Math.max(2, (count / maxCount) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
