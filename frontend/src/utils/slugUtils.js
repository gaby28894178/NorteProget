/**
 * Convierte un texto en un slug amigable para URLs.
 * Ejemplo: "Buzos & Camperas" -> "buzos-camperas"
 */
export const generateSlug = (text) => {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina acentos
    .replace(/[^a-z0-9 -]/g, "") // Elimina caracteres especiales
    .replace(/\s+/g, "-") // Reemplaza espacios por guiones
    .replace(/-+/g, "-"); // Evita guiones dobles
};

/**
 * Patrón que valida el formato de un slug:
 * solo minúsculas, números y guiones simples, sin guiones al inicio/final.
 */
export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isValidSlug = (slug) => slugPattern.test(slug);

export const isSlugTaken = (slug, existingCategories, excludeId) =>
  existingCategories.some(
    (category) => category.slug === slug && category.id !== excludeId,
  );
