// src/components/admin/CategoryTable.jsx
import { LuPencil, LuTrash2 } from "react-icons/lu";

export const CategoryTable = ({ categories, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full min-w-max text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b border-norte-stone/60">
          <tr>
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Slug</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-norte-stone/50">
          {categories.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                No hay categorías disponibles.
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id} className="hover:bg-norte-bg/50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {category.id}
                </td>
                <td className="px-6 py-4 font-semibold text-norte-dark">
                  {category.name}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-gray-500">
                  {category.slug}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      category.is_active
                        ? "bg-norte-forest/10 text-norte-forest"
                        : "bg-norte-stone/40 text-norte-dark"
                    }`}
                  >
                    {category.is_active ? "Activa" : "Inactiva"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <button
                    onClick={() => onEdit(category)}
                    title="Editar"
                    aria-label={`Editar ${category.name}`}
                    className="p-2 rounded-md text-norte-forest hover:bg-norte-forest/10"
                  >
                    <LuPencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(category.id)}
                    title="Eliminar"
                    aria-label={`Eliminar ${category.name}`}
                    className="p-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <LuTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
