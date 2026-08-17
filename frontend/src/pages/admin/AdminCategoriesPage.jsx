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
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  } = useCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-norte-dark">
            Gestión de Categorías
          </h1>
          <p className="text-sm text-gray-500">
            Administra las categorías de ropa y accesorios del catálogo
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="w-full sm:w-auto px-4 py-2 bg-norte-mustard text-white font-medium rounded-btn hover:bg-mostaza-4 transition-colors"
        >
          + Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-norte-dark mb-4">
              {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
            </h2>
            <CategoryForm
              key={editingCategory ? editingCategory.id : "new"}
              initialData={editingCategory}
              existingCategories={categories}
              onSubmit={handleSave}
              onCancel={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};
