// src/components/admin/ProductForm.jsx
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { LuPlus, LuTrash2 } from "react-icons/lu";

const defaultVariant = {
  size: "",
  color: "",
  stock: 0,
  is_default: false,
};
const defaultImage = { secure_url: "", display_order: 1 };

const nextDisplayOrder = (images) =>
  images.length === 0
    ? 1
    : Math.max(...images.map((img) => Number(img.display_order) || 0)) + 1;

export const ProductForm = ({
  initialData = null,
  categories = [],
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category_id: initialData?.category_id ?? "",
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      current_price: initialData?.current_price ?? "",
      status: initialData?.status ?? "PUBLISHED",
      variants:
        initialData?.variants?.length > 0
          ? initialData.variants.map((variant) => ({ ...variant }))
          : [{ ...defaultVariant, is_default: true }],
      images:
        initialData?.images?.length > 0
          ? initialData.images.map((image) => ({ ...image }))
          : [{ ...defaultImage }],
    },
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });
  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  // URLs de previsualización local para los archivos seleccionados (blob).
  // Se usan mientras no llegue la respuesta del backend con la URL real.
  const [previews, setPreviews] = useState({});

  const handleFileChange = (index, file) => {
    if (!file) {
      setPreviews((prev) => {
        const next = { ...prev };
        delete next[index];
        return next;
      });
      setValue(`images.${index}.secure_url`, "");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [index]: objectUrl }));
    // El secure_url real lo provee el backend al subir a Cloudinary.
    // Mientras tanto guardamos el archivo para el envío (FormData).
    setValue(`images.${index}.file`, file, { shouldValidate: false });
    setValue(`images.${index}.secure_url`, "", { shouldValidate: false });
  };

  const nameRegister = register("name", {
    required: "El nombre del producto es requerido.",
    maxLength: { value: 150, message: "Máximo 150 caracteres." },
  });

  const handleToggleDefault = (index) => {
    getValues("variants").forEach((_, i) => {
      setValue(`variants.${i}.is_default`, i === index, {
        shouldValidate: true,
      });
    });
  };

  const handleAppendVariant = () => {
    const hasDefault = getValues("variants").some((v) => v.is_default);
    appendVariant({ ...defaultVariant, is_default: !hasDefault });
  };

  const handleAppendImage = () => {
    appendImage({
      secure_url: "",
      display_order: nextDisplayOrder(getValues("images")),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* ============ DATOS GENERALES ============ */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark border-b border-norte-stone/60 pb-2">
          Datos generales
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            {...register("category_id", {
              required: "Seleccioná una categoría.",
            })}
            className="w-full px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard bg-white"
          >
            <option value="">Seleccionar categoría...</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category_id && (
            <p className="text-xs text-red-600 mt-1">
              {errors.category_id.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              {...nameRegister}
              className="w-full px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard"
              placeholder="Ej: Buzo Norte"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          {initialData?.slug && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug (código generado)
              </label>
              <input
                type="text"
                value={initialData.slug}
                readOnly
                className="w-full px-3 py-2 border border-norte-stone bg-gray-100 rounded-md font-mono text-sm text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Generado automáticamente por el sistema
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard"
            placeholder="Descripción detallada del producto (opcional)"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio actual ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              onWheel={(e) => e.target.blur()}
              {...register("current_price", {
                required: "El precio es requerido.",
                min: { value: 0, message: "El precio no puede ser negativo." },
              })}
              className="w-full px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard"
              placeholder="0.00"
            />
            {errors.current_price && (
              <p className="text-xs text-red-600 mt-1">
                {errors.current_price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              {...register("status", { required: "El estado es requerido." })}
              className="w-full px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard bg-white"
            >
              <option value="PUBLISHED">Publicado</option>
              <option value="UNPUBLISHED">Oculto</option>
            </select>
            {errors.status && (
              <p className="text-xs text-red-600 mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ============ VARIANTES ============ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-norte-stone/60 pb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark">
            Variantes (talla / color)
          </h3>
          <button
            type="button"
            onClick={handleAppendVariant}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-norte-forest border border-norte-forest/40 rounded-md hover:bg-norte-forest/10"
          >
            <LuPlus size={14} /> Agregar variante
          </button>
        </div>

        {errors.variants?.message && (
          <p className="text-xs text-red-600">{errors.variants.message}</p>
        )}

        {variantFields.map((field, index) => (
          <div
            key={field.id}
            className="border border-norte-stone/70 rounded-md p-3 space-y-3 bg-norte-bg/30"
          >
            {initialData?.variants?.[index]?.sku && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  SKU (código generado)
                </label>
                <input
                  type="text"
                  value={initialData.variants[index].sku}
                  readOnly
                  className="w-full px-3 py-2 border border-norte-stone bg-gray-100 rounded-md font-mono text-xs text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Generado automáticamente por el sistema
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Talla
                </label>
                <input
                  type="text"
                  {...register(`variants.${index}.size`, {
                    maxLength: { value: 30, message: "Máximo 30 caracteres." },
                    validate: (value) => {
                      if (!value) return true;
                      const size = value;
                      const color = getValues(`variants.${index}.color`) ?? "";
                      const duplicated = getValues("variants").some(
                        (variant, i) =>
                          i !== index &&
                          variant.size === size &&
                          (variant.color ?? "") === color,
                      );
                      return (
                        !duplicated ||
                        "Ya existe una variante con esta talla y color."
                      );
                    },
                  })}
                  className="w-full px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard"
                  placeholder="S, M, 42..."
                />
                {errors.variants?.[index]?.size && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.variants[index].size.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  {...register(`variants.${index}.color`, {
                    maxLength: { value: 50, message: "Máximo 50 caracteres." },
                  })}
                  className="w-full px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard"
                  placeholder="Negro"
                />
                {errors.variants?.[index]?.color && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.variants[index].color.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    {...register(`variants.${index}.stock`, {
                      required: "El stock es requerido.",
                      min: { value: 0, message: "No puede ser negativo." },
                    })}
                    className="w-24 px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard"
                    placeholder="0"
                  />
                  {errors.variants?.[index]?.stock && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.variants[index].stock.message}
                    </p>
                  )}
                </div>

                <label className="flex items-center gap-2 mt-5 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(`variants.${index}.is_default`)}
                    onChange={() => handleToggleDefault(index)}
                    className="h-4 w-4 text-norte-mustard rounded border-norte-stone focus:ring-norte-mustard"
                  />
                  Variante predeterminada
                </label>
              </div>

              <button
                type="button"
                onClick={() => removeVariant(index)}
                title="Eliminar variante"
                aria-label="Eliminar variante"
                className="p-2 rounded-md text-red-600 hover:bg-red-50 mt-4"
              >
                <LuTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ============ IMÁGENES ============ */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-norte-stone/60 pb-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-norte-dark">
            Imágenes
          </h3>
          <button
            type="button"
            onClick={handleAppendImage}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-norte-forest border border-norte-forest/40 rounded-md hover:bg-norte-forest/10"
          >
            <LuPlus size={14} /> Agregar imagen
          </button>
        </div>

        {imageFields.map((field, index) => (
          <div
            key={field.id}
            className="border border-norte-stone/70 rounded-md p-3 bg-norte-bg/30"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">
                    Imagen (jpg / jpeg / png / webp)
                  </p>
                  <div className="flex items-center gap-2">
                    <label
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border border-norte-forest/40 rounded-md cursor-pointer hover:bg-norte-forest/10 ${
                        errors.images?.[index]?.secure_url
                          ? "border-red-500"
                          : "border-norte-stone"
                      }`}
                    >
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                        {...register(`images.${index}.file`, {
                          validate: (file) => {
                            if (!file || !(file instanceof File)) return true;
                            if (!/\.(jpe?g|png|webp)$/i.test(file.name)) {
                              return "Solo se permiten jpg, jpeg, png o webp.";
                            }
                            if (file.size > 5 * 1024 * 1024) {
                              return "La imagen pesa máximo 5 MB.";
                            }
                            return true;
                          },
                        })}
                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                      />
                      {previews[index] ||
                      getValues(`images.${index}.secure_url`)
                        ? "Cambiar imagen"
                        : "Seleccionar archivo"}
                    </label>
                    <span className="text-xs text-gray-500 truncate max-w-50">
                      {getValues(`images.${index}.file`)?.name ??
                        previews[index] ??
                        "Sin archivo seleccionado"}
                    </span>
                  </div>
                  {errors.images?.[index]?.file && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.images[index].file.message}
                    </p>
                  )}
                  {errors.images?.[index]?.secure_url && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.images[index].secure_url.message}
                    </p>
                  )}
                </div>
                <div className="max-w-24">
                  <label
                    htmlFor={`img-order-${index}`}
                    className="block text-xs font-medium text-gray-600 mb-1"
                  >
                    Orden
                  </label>
                  <input
                    id={`img-order-${index}`}
                    type="number"
                    min="1"
                    {...register(`images.${index}.display_order`, {
                      required: "El orden es requerido.",
                      min: { value: 1, message: "Mínimo 1." },
                      validate: (value) =>
                        !getValues("images").some(
                          (image, i) =>
                            i !== index &&
                            Number(image.display_order) === Number(value),
                        ) || "El orden debe ser único por producto.",
                    })}
                    className="w-full px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard"
                  />
                  {errors.images?.[index]?.display_order && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.images[index].display_order.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-row sm:flex-col items-center gap-2">
                {(previews[index] ||
                  getValues(`images.${index}.secure_url`)) && (
                  <img
                    src={
                      previews[index] || getValues(`images.${index}.secure_url`)
                    }
                    alt={`Vista previa ${index + 1}`}
                    className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-md object-cover border border-norte-stone"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  title="Eliminar imagen"
                  aria-label="Eliminar imagen"
                  className="p-2 rounded-md text-red-600 hover:bg-red-50"
                >
                  <LuTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ============ ACCIONES ============ */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-norte-dark bg-norte-stone/50 rounded-md hover:bg-norte-stone"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-norte-mustard rounded-btn hover:bg-mostaza-4"
        >
          {initialData ? "Guardar Cambios" : "Crear Producto"}
        </button>
      </div>
    </form>
  );
};
