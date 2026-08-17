// src/components/admin/ProductTable.jsx
import { LuEye, LuPencil, LuTrash2 } from "react-icons/lu";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export const ProductTable = ({
  products,
  categories = [],
  onEdit,
  onDelete,
  onView,
}) => {
  const categoryName = (categoryId) =>
    categories.find((cat) => cat.id === categoryId)?.name ?? "—";

  const mainImage = (product) =>
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0].secure_url
      : null;

  const totalStock = (product) =>
    Array.isArray(product.variants)
      ? product.variants.reduce((acc, variant) => acc + (variant.stock || 0), 0)
      : 0;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full min-w-max text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b border-norte-stone/60">
          <tr>
            <th className="px-6 py-3">Producto</th>
            <th className="px-6 py-3">Categoría</th>
            <th className="px-6 py-3">Precio</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3">Variantes</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-norte-stone/50">
          {products.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                No hay productos disponibles.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                onClick={() => onView?.(product)}
                className={`hover:bg-norte-bg/50 ${onView ? "cursor-pointer" : ""}`}
                title={onView ? `Ver ${product.name}` : undefined}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {mainImage(product) ? (
                      <img
                        src={mainImage(product)}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-norte-stone/50 flex items-center justify-center text-norte-stone">
                        —
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-norte-dark">
                        {product.name}
                      </div>
                      <div className="font-mono text-xs text-gray-400">
                        {product.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {categoryName(product.category_id)}
                </td>
                <td className="px-6 py-4 font-medium text-norte-dark">
                  {currencyFormatter.format(product.current_price)}
                </td>
                <td className="px-6 py-4">{totalStock(product)}</td>
                <td className="px-6 py-4">
                  {Array.isArray(product.variants)
                    ? product.variants.length
                    : 0}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === "PUBLISHED"
                        ? "bg-norte-forest/10 text-norte-forest"
                        : "bg-norte-stone/40 text-norte-dark"
                    }`}
                  >
                    {product.status === "PUBLISHED" ? "Publicado" : "Oculto"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  {onView && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(product);
                      }}
                      title="Ver"
                      aria-label={`Ver ${product.name}`}
                      className="p-2 rounded-md text-norte-mustard hover:bg-norte-mustard/10"
                    >
                      <LuEye size={18} />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(product);
                    }}
                    title="Editar"
                    aria-label={`Editar ${product.name}`}
                    className="p-2 rounded-md text-norte-forest hover:bg-norte-forest/10"
                  >
                    <LuPencil size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(product);
                    }}
                    title="Eliminar"
                    aria-label={`Eliminar ${product.name}`}
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
