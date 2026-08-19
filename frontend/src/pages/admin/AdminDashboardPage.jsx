// src/pages/admin/AdminDashboardPage.jsx
import { LuCloud, LuLoader, LuRefreshCcw, LuInfo } from "react-icons/lu";

import { useAnalytics } from "../../hooks/useAnalytics";
import { MetricCard } from "../../components/admin/MetricCard";
import { ConversionFunnel } from "../../components/admin/ConversionFunnel";

const PERIODS = [
  { days: 7, label: "7 días" },
  { days: 30, label: "30 días" },
  { days: 90, label: "90 días" },
];

const formatCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const formatCount = new Intl.NumberFormat("es-AR", {
  maximumFractionDigits: 0,
});

const formatPercent = (value) =>
  `${new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: 1,
  }).format(value)}%`;

export const AdminDashboardPage = () => {
  const {
    data,
    days,
    loading,
    error,
    source,
    connecting,
    changeDays,
    connectGoogle,
    disconnectGoogle,
    refresh,
  } = useAnalytics();

  const isLive = source === "ga4";
  const funnel = data?.funnel || {};
  const summary = data?.summary || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-norte-dark">
            Dashboard de Métricas
          </h1>
          <p className="text-sm text-gray-500">
            Desempeño del negocio y embudo de conversión
          </p>
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-md border border-norte-stone overflow-hidden bg-white">
            {PERIODS.map((period) => (
              <button
                key={period.days}
                type="button"
                onClick={() => changeDays(period.days)}
                className={`px-3 py-2 text-xs font-medium transition ${
                  days === period.days
                    ? "bg-norte-mustard text-white"
                    : "text-gray-600 hover:text-norte-mustard"
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={refresh}
            title="Actualizar datos"
            aria-label="Actualizar datos"
            className="p-2 rounded-md border border-norte-stone bg-white text-norte-dark hover:text-norte-mustard"
          >
            <LuRefreshCcw size={16} />
          </button>

          {isLive ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-norte-forest text-white text-xs font-medium">
                <span className="h-2 w-2 rounded-full bg-green-400" />
                Datos de GA4
              </span>
              <button
                type="button"
                onClick={disconnectGoogle}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-600 border border-norte-stone bg-white hover:text-norte-mustard"
              >
                Usar demo
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={connectGoogle}
              disabled={connecting}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-norte-mustard text-white text-xs font-medium hover:bg-mostaza-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {connecting ? (
                <LuLoader size={14} className="animate-spin" />
              ) : (
                <LuCloud size={14} />
              )}
              {connecting ? "Conectando..." : "Conectar Google Analytics"}
            </button>
          )}
        </div>
      </div>

      {/* Aviso de datos demo */}
      {!loading && data && !isLive && (
        <div className="flex items-start gap-3 p-4 rounded-md bg-mostaza-1/50 border border-mostaza-3/40">
          <LuInfo size={18} className="mt-0.5 shrink-0 text-mostaza-7" />
          <p className="text-sm text-mostaza-9">
            Mostrando <strong>datos de demostración</strong> del embudo. Conectá
            tu cuenta de Google para ver las métricas reales de GA4.
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {loading || !data ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <LuLoader size={18} className="animate-spin mr-2" />
          Cargando métricas...
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <MetricCard
              label="Visitas"
              value={formatCount.format(summary.visitas)}
            />
            <MetricCard
              label="Compras"
              value={formatCount.format(summary.compras)}
              hint={
                summary.conversionRate > 0
                  ? `Conversion ${formatPercent(summary.conversionRate)}`
                  : null
              }
            />
            <MetricCard
              label="Ingresos"
              value={formatCurrency.format(summary.ingresos)}
            />
            <MetricCard
              label="Ticket promedio"
              value={formatCurrency.format(summary.ticketPromedio)}
            />
            <MetricCard
              label="Tasa de conversión"
              value={formatPercent(summary.conversionRate)}
              hint={`${formatCount.format(summary.compras)} compras`}
            />
            <MetricCard
              label="Carrito abandonado"
              value={formatPercent(summary.carritoAbandonado)}
              negative
              hint="No completaron la compra"
            />
          </div>

          {/* Embudo de conversión */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-baseline justify-between gap-4 border-b border-norte-stone/60 pb-3 mb-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-norte-dark">
                Embudo de conversión
              </h2>
              <span className="text-xs text-gray-400">
                Del catálogo a la compra confirmada
              </span>
            </div>

            <ConversionFunnel funnel={funnel} />
          </div>
        </>
      )}
    </div>
  );
};