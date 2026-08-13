// src/components/admin/ProductDetail.jsx
import { useState } from "react";
import { LuArrowLeft, LuPencil } from "react-icons/lu";

const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

// Mapeo visual nombre de color -> hex para los cuadritos de color.
// Es solo de presentación; los datos siguen almacenando el nombre.
const COLOR_HEX = {
  negro: "#1c1b19",
  blanco: "#ffffff",
  gris: "#9ca3af",
  "gris oxford": "#7d8184",
  "azul marino": "#1f2d52",
  "verde militar": "#4b5d3c",
  beige: "#d9c7a7",
  rojo: "#b91c1c",
  azul: "#1d4ed8",
};

const colorToHex = (colorName) => {
  if (!colorName) return "#d8d2c4";
  return COLOR_HEX[colorName.trim().toLowerCase()] ?? "#d8d2c4";
};

const categoryName = (categories, categoryId) =>
  categories.find((cat) => cat.id === categoryId)?.name ?? "—";

const groupByColor = (variants) => {
  const grouped = new Map();
  variants.forEach((variant) => {
    const key = variant.color || "Sin color";
    const current = grouped.get(key) || { name: key, stock: 0, count: 0 };
    current.stock += variant.stock || 0;
    current.count += 1;
    grouped.set(key, current);
  });
  return [...grouped.values()];
};

const groupBySize = (variants) => {
  const grouped = new Map();
  variants.forEach((variant) => {
    const key = variant.size || "Única";
    const current = grouped.get(key) || { name: key, stock: 0, count: 0 };
    current.stock += variant.stock || 0;
    current.count += 1;
    grouped.set(key, current);
  });
  return [...grouped.values()];
};

export const ProductDetail = ({ product, categories = [], onEdit, onBack }) => {
  const [activeImage, setActiveImage] = useState(0);

  const images = Array.isArray(product.images) ? product.images : [];
  const variants = Array.isArray(product.variants) ? product.variants : [];

  const mainImage = images[activeImage]?.secure_url ?? images[0]?.secure_url;
  const colors = groupByColor(variants);
  const sizes = groupBySize(variants);
  const totalStock = variants.reduce((acc, v) => acc + (v.stock || 0), 0);

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            title="Volver a la lista"
            aria-label="Volver a la lista de productos"
            className="p-2 rounded-md text-norte-dark hover:bg-norte-stone/40"
          >
            <LuArrowLeft size={22} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-norte-dark">
              {product.name}
            </h1>
            <p className="text-sm text-gray-500 font-mono">{product.slug}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-norte-dark bg-norte-stone/50 rounded-md hover:bg-norte-stone"
          >
            Volver a la lista
          </button>
          <button
            onClick={onEdit}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-norte-forest rounded-md hover:opacity-90"
          >
            <LuPencil size={16} /> Editar
          </button>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Galería */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark border-b border-norte-stone/60 pb-2">
            Imágenes ({images.length})
          </h3>

          <div className="aspect-square w-full overflow-hidden rounded-md bg-norte-bg">
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-norte-stone">
                Sin imagen
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id ?? index}
                  onClick={() => setActiveImage(index)}
                  title={`Ver imagen ${index + 1}`}
                  aria-label={`Ver imagen ${index + 1}`}
                  className={`h-16 w-16 shrink-0 rounded-md overflow-hidden border-2 ${
                    activeImage === index
                      ? "border-norte-mustard"
                      : "border-transparent hover:border-norte-stone"
                  }`}
                >
                  <img
                    src={image.secure_url}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información */}
        <div className="bg-white rounded-lg shadow p-4 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark border-b border-norte-stone/60 pb-2">
            Información
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Categoría</p>
              <p className="font-medium text-norte-dark">
                {categoryName(categories, product.category_id)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Estado</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  product.status === "PUBLISHED"
                    ? "bg-norte-forest/10 text-norte-forest"
                    : "bg-norte-stone/40 text-norte-dark"
                }`}
              >
                {product.status === "PUBLISHED" ? "Publicado" : "Oculto"}
              </span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Precio actual</p>
              <p className="text-2xl font-extrabold text-norte-dark">
                {currencyFormatter.format(product.current_price)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Stock total</p>
              <p className="text-2xl font-bold text-norte-dark">{totalStock}</p>
            </div>
          </div>

          {product.description && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Descripción</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resumen visual de stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colores disponibles */}
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark border-b border-norte-stone/60 pb-2">
            Colores disponibles
          </h3>
          <div className="flex flex-wrap gap-3">
            {colors.length === 0 ? (
              <p className="text-sm text-gray-500">Sin variantes de color.</p>
            ) : (
              colors.map((color) => (
                <div
                  key={color.name}
                  className="flex items-center gap-2 text-sm"
                  title={`${color.name}: ${color.stock} unidades en ${color.count} variante(s)`}
                >
                  <span
                    className="h-6 w-6 rounded-full border border-norte-stone/70"
                    style={{
                      backgroundColor: colorToHex(color.name),
                      display: "inline-block",
                    }}
                    aria-hidden="true"
                  />
                  <span className="text-gray-700">{color.name}</span>
                  <span className="text-gray-400">({color.stock})</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Talles disponibles */}
        <div className="bg-white rounded-lg shadow p-4 space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark border-b border-norte-stone/60 pb-2">
            Talles disponibles
          </h3>
          <div className="flex flex-wrap gap-2">
            {sizes.length === 0 ? (
              <p className="text-sm text-gray-500">Sin variantes de talle.</p>
            ) : (
              sizes.map((size) => (
                <span
                  key={size.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-norte-bg border border-norte-stone text-sm text-norte-dark"
                  title={`Talle ${size.name}: ${size.stock} unidades`}
                >
                  {size.name}
                  <span className="text-gray-400">({size.stock})</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tabla detallada de variantes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-norte-stone/60">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark">
            Variantes y stock ({variants.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b border-norte-stone/60">
              <tr>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3">Talle</th>
                <th className="px-6 py-3">Color</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Predeterminada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-norte-stone/50">
              {variants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Este producto no tiene variantes.
                  </td>
                </tr>
              ) : (
                variants.map((variant) => (
                  <tr key={variant.id} className="hover:bg-norte-bg/50">
                    <td className="px-6 py-3 font-mono text-xs">{variant.sku}</td>
                    <td className="px-6 py-3">{variant.size || "Única"}</td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-4 w-4 rounded-full border border-norte-stone/70"
                          style={{
                            backgroundColor: colorToHex(variant.color),
                            display: "inline-block",
                          }}
                          aria-hidden="true"
                        />
                        {variant.color || "Sin color"}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-medium text-norte-dark">
                      {variant.stock}
                    </td>
                    <td className="px-6 py-3">
                      {variant.is_default ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-norte-mustard/15 text-norte-mustard">
                          Predeterminada
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};