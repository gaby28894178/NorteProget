/* Generador de SKU  - formato: CATEGORIA-CODIGO-Color-TALLE */
/**
 * Normaliza un texto: mayúsculas, sin acentos, sin caracteres especiales.
 * Ej: "Verde Militar" -> "VERDEMILITAR", "Pantalón" -> "PANTALON"
 */
const normalize = (value) =>
  (value || "")
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "");

/**
 * Limpia y recorta cualquier texto a 3 letras en mayúsculas.
 * Ej: "Verde Militar" -> "VER", "Negro" -> "NEG", "Gorra" -> "GOR"
 */
const to3Letters = (str) => {
  const clean = normalize(str);
  if (!clean) return "XXX";
  return clean.slice(0, 3).padEnd(3, "X"); // Si tiene menos de 3 letras, rellena con X
};

/**
 * Normaliza el talle a un formato estándar.
 */
const formatSize = (size) => {
  if (!size) return "UNI";
  const clean = size.toString().trim().toUpperCase();
  if (clean === "ÚNICA" || clean === "UNICA" || clean === "ONE SIZE") {
    return "UNI";
  }
  return clean.replace(/[^A-Z0-9]/g, ""); // "S", "M", "38", etc.
};

/**
 * Deriva un código de producto distintivo a partir de su nombre y categoría.
 * Ej: "Remera Norte" -> "NOR", "Pantalón Clásico" -> "CLA", "Gorra Norte" -> "NOR"
 */
const getProductCode = (productName, categoryName) => {
  if (!productName) return "XXX";
  const category = normalize(categoryName);

  // Tokens de la categoría (singular y plural) para descartarlos del nombre.
  const categories = new Set([category]);
  if (category.endsWith("S")) categories.add(category.slice(0, -1));

  const isCategoryToken = (token) => {
    if (categories.has(token)) return true;
    // Comparación por prefijo: "PANTALONES" y "PANTALON" comparten raíz.
    for (const cat of categories) {
      if (cat.startsWith(token) || token.startsWith(cat)) return true;
    }
    return false;
  };

  const nameTokens = productName
    .split(/\s+/)
    .map(normalize)
    .filter(Boolean)
    .filter((token) => !isCategoryToken(token));

  const distinctive =
    nameTokens.length > 0 ? nameTokens.join("") : normalize(productName);
  return to3Letters(distinctive);
};

/**
 * Generador de SKU Estricto
 */
export const generateSKU = (categoryOrType, productName, color, size) => {
  const categoryCode = to3Letters(categoryOrType); // REM, CAM, PAN, BUZ, ACC...
  const productCode = getProductCode(productName, categoryOrType); // NRT, URB, CAR...
  const colorCode = to3Letters(color); // NEG, BEI, GRI, VER...
  const sizeCode = formatSize(size); // S, M, 38, UNI...

  return `${categoryCode}-${productCode}-${colorCode}-${sizeCode}`;
};
