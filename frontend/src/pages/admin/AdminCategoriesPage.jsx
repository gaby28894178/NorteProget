// src/pages/admin/AdminCategoriesPage.jsx
import { useCategories } from "../../hooks/useCategories";
import { CategoryTable } from "../../components/admin/CategoryTable";
import { CategoryForm } from "../../components/admin/CategoryForm";

export const AdminCategoriesPage = () => {
  const {
    categories,
    loading,
    error,
    isModalOpen,
    editingCategory,
    // Paginación
    page,
    pagination,
    searchInput,
    setSearchInput,
    handlePageChange,
    // CRUD
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  } = useCategories();

  const totalPages = pagination?.totalPages ?? 1;
  const total = pagination?.total ?? 0;

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-norte-dark">
            Gestión de Categorías
          </h1>
          <p className="text-sm text-gray-500">
            {total > 0
              ? `${total} categoría${total === 1 ? "" : "s"} encontrada${total === 1 ? "" : "s"}`
              : "Administra las categorías de ropa y accesorios del catálogo"}
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-2 bg-norte-mustard text-white font-medium rounded-btn hover:bg-mostaza-4 transition-colors"
        >
          + Nueva Categoría
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Buscar categoría por nombre..."
          className="w-full sm:w-80 px-4 py-2 pl-10 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard text-sm"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchInput && (
          <button
            onClick={() => setSearchInput("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-norte-dark"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {/* Tabla o loading */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Cargando categorías...
        </div>
      ) : (
        <CategoryTable
          categories={categories}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Paginación */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1.5 text-xs font-medium text-norte-dark bg-norte-stone/50 rounded-md hover:bg-norte-stone disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 5) return true;
                if (p === 1 || p === totalPages) return true;
                if (Math.abs(p - page) <= 1) return true;
                return false;
              })
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-xs text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                      item === page
                        ? "bg-norte-mustard text-white"
                        : "text-norte-dark bg-norte-stone/30 hover:bg-norte-stone/60"
                    }`}
                  >
                    {item}
                  </button>
                ),
              )}
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1.5 text-xs font-medium text-norte-dark bg-norte-stone/50 rounded-md hover:bg-norte-stone disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal de crear/editar */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-norte-dark mb-4">
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <CategoryForm
              key={editingCategory ? editingCategory.id : "new"}
              initialData={editingCategory}
              onSubmit={handleSave}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};
