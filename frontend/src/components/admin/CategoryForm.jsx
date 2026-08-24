import { useForm } from "react-hook-form";

export const CategoryForm = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      is_active: initialData?.is_active ?? true,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Categoría
        </label>
        <input
          type="text"
          {...register("name", {
            required: "El nombre de la categoría es requerido.",
            maxLength: { value: 100, message: "Máximo 100 caracteres." },
          })}
          className="w-full px-3 py-2 border border-norte-stone rounded-md focus:outline-none focus:ring-2 focus:ring-norte-mustard"
          placeholder="Ej: Remeras y Musculosas"
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
