import { useForm } from "react-hook-form";
import { generateSlug, slugPattern, isSlugTaken } from "../../utils/slugUtils";

export const CategoryForm = ({
  initialData,
  existingCategories = [],
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const nameRegister = register("name", {
    required: "El nombre de la categoría es requerido.",
    maxLength: { value: 100, message: "Máximo 100 caracteres." },
  });

  const handleNameChange = (e) => {
    nameRegister.onChange(e);
    if (!initialData) {
      setValue("slug", generateSlug(e.target.value));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Categoría
        </label>
        <input
          type="text"
          {...nameRegister}
          onChange={handleNameChange}
          className="w-full px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard"
          placeholder="Ej: Remeras y Musculosas"
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>
        <input
          type="text"
          {...register("slug", {
            required: "El slug es requerido.",
            maxLength: { value: 120, message: "Máximo 120 caracteres." },
            pattern: {
              value: slugPattern,
              message:
                "Solo minúsculas, números y guiones (ej: remeras-y-musculosas).",
            },
            validate: (value) =>
              !isSlugTaken(value, existingCategories, initialData?.id) ||
              "Ya existe una categoría con este slug.",
          })}
          className="w-full px-3 py-2 border border-norte-stone bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard font-mono text-sm"
          placeholder="remeras-y-musculosas"
        />
        {errors.slug && (
          <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        <input
          type="checkbox"
          id="is_active"
          {...register("is_active")}
          className="h-4 w-4 text-norte-mustard rounded border-norte-stone focus:ring-norte-mustard"
        />
        <label
          htmlFor="is_active"
          className="text-sm font-medium text-gray-700"
        >
          Categoría Activa (Visible en el catálogo)
        </label>
      </div>

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
          {initialData ? "Guardar Cambios" : "Crear Categoría"}
        </button>
      </div>
    </form>
  );
};
