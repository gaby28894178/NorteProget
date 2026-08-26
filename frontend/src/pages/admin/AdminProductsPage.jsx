// src/pages/admin/AdminProductsPage.jsx
import { LuArrowLeft, LuLoader } from "react-icons/lu";
import { useProducts } from "../../hooks/useProducts";
import { ProductTable } from "../../components/admin/ProductTable";
import { ProductFilters } from "../../components/admin/ProductFilters";
import { ProductForm } from "../../components/admin/ProductForm";
import { ProductDetail } from "../../components/admin/ProductDetail";

export const AdminProductsPage = () => {
  const {
    products,
    allProductsCount,
    categories,
    loading,
    error,
    isFormOpen,
    editingProduct,
    viewingProduct,
    handleOpenCreate,
    handleOpenView,
    handleOpenEdit,
    handleCloseForm,
    handleCloseView,
    handleSave,
    deleteTarget,
    deleting,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
    // Filtros
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    handleSort,
    hasActiveFilters,
    clearFilters,
  } = useProducts();

  // Al editar desde la vista de detalle, resolvemos el producto con su versión
  // más reciente (tras los fetchProducts) para que el detalle siempre se
  // actualice si el usuario vuelve después de guardar.
  const activeView = viewingProduct
    ? (products.find((p) => String(p.id) === String(viewingProduct.id)) ??
      viewingProduct)
    : null;

  // Modo "vista detalle" del producto (vista de página completa).
  if (activeView && !isFormOpen) {
    return (
      <div className="space-y-6">
        <ProductDetail
          product={activeView}
          categories={categories}
          onBack={handleCloseView}
          onEdit={() => handleOpenEdit(activeView)}
        />
      </div>
    );
  }

  // Modo "vista de página" del formulario: al crear/editar, el form ocupa
  // todo el ancho del área de trabajo del admin (como la lista de categorías),
  // en lugar de un drawer flotante que queda amontonado a la derecha.
  if (isFormOpen) {
    const backLabel = editingProduct ? "Cancelar edición" : "Volver a la lista";
    const backText = editingProduct ? "Cancelar" : "Volver a la lista";
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleCloseForm}
              title={backLabel}
              aria-label={backLabel}
              className="p-2 rounded-md text-norte-dark hover:bg-norte-stone/40"
            >
              <LuArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-norte-dark">
                {editingProduct ? "Editar Producto" : "Nuevo Producto"}
              </h1>
              <p className="text-sm text-gray-500">
                {editingProduct
                  ? `Editando: ${editingProduct.name}`
                  : "Completá los datos del nuevo producto"}
              </p>
            </div>
          </div>
          <button
            onClick={handleCloseForm}
            className="px-4 py-2 text-sm font-medium text-norte-dark bg-norte-stone/50 rounded-md hover:bg-norte-stone"
          >
            {backText}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ProductForm
            key={editingProduct ? editingProduct.id : "new"}
            initialData={editingProduct}
            categories={categories}
            onSubmit={handleSave}
            onCancel={handleCloseForm}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-norte-dark">
            Gestión de Productos
          </h1>
          <p className="text-sm text-gray-500">
            Administra los productos del catálogo, sus variantes e imágenes
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-2 bg-norte-mustard text-white font-medium rounded-btn hover:bg-mostaza-4 transition-colors"
        >
          + Nuevo Producto
        </button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-10 text-gray-500">
          <LuLoader size={18} className="animate-spin" />
          Cargando productos...
        </div>
      ) : (
        <>
          <ProductFilters
            searchInput={searchInput}
            onSearchChange={setSearchInput}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            resultCount={products.length}
            totalCount={allProductsCount}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />

          <div className="relative">
            <ProductTable
              products={products}
              categories={categories}
              onView={handleOpenView}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteRequest}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </div>
        </>
      )}

      {/* ============ CONFIRMACIÓN DE BORRADO ============ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-norte-dark mb-2">
              Eliminar producto
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que querés eliminar{" "}
              <strong className="text-norte-dark">{deleteTarget.name}</strong>?
              Se eliminarán también sus variantes e imágenes. Esta acción no se
              puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-norte-dark bg-norte-stone/50 rounded-md hover:bg-norte-stone disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
