import { FaTimes } from "react-icons/fa";

// Panel de filtros del catálogo. Se reutiliza en dos lugares:
// - Sidebar fijo en desktop (>= lg)
// - Drawer superpuesto con blur en móvil (onClose presente)
export const FilterSidebar = ({
  categorias,
  colores,
  talles,
  categoriaSeleccionada,
  coloresSeleccionados,
  tallesSeleccionados,
  handleCategoriaChange,
  handleColorChange,
  handleTalleChange,
  limpiarFiltros,
  hayFiltrosActivos,
  onClose,
}) => {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[28px] font-semibold">Filtrar por</h2>

        <div className="flex items-center gap-1">
          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="text-xs text-norte-mustard hover:underline"
            >
              Limpiar
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar filtros"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:border-norte-mustard hover:text-norte-mustard"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* =========================
          CATEGORÍAS
      ========================== */}

      <div className="border-b border-gray-200 py-6">
        <h3 className="mb-5 text-lg font-medium uppercase tracking-wide text-gray-500">
          Categorías
        </h3>

        <div className="flex flex-col gap-3">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              onClick={() => handleCategoriaChange(categoria)}
              className={`text-left text-base transition ${
                categoriaSeleccionada === categoria
                  ? "font-semibold text-norte-mustard"
                  : "text-gray-700 hover:text-norte-mustard"
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>
      </div>

      {/* =========================
          COLORES
      ========================== */}

      <div className="border-b border-gray-200 py-6">
        <h3 className="mb-5 text-lg font-medium uppercase tracking-wide text-gray-500">
          Color
        </h3>

        <div className="flex flex-col gap-3">
          {colores.map((color) => (
            <label
              key={color}
              className="flex cursor-pointer items-center gap-3 text-base text-gray-700"
            >
              <input
                type="checkbox"
                checked={coloresSeleccionados.includes(color)}
                onChange={() => handleColorChange(color)}
                className="h-3 w-3 rounded border-gray-400 accent-norte-mustard"
              />

              <span>{color}</span>
            </label>
          ))}
        </div>
      </div>

      {/* =========================
          TALLES
      ========================== */}

      <div className="py-6">
        <h3 className="mb-5 text-lg font-medium uppercase tracking-wide text-gray-500">
          Talles
        </h3>

        <div className="flex flex-col gap-3">
          {talles.map((talle) => (
            <label
              key={talle}
              className="flex cursor-pointer items-center gap-3 text-base text-gray-700"
            >
              <input
                type="checkbox"
                checked={tallesSeleccionados.includes(talle)}
                onChange={() => handleTalleChange(talle)}
                className="h-3 w-3 rounded border-gray-400 accent-norte-mustard"
              />

              <span>{talle}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
};