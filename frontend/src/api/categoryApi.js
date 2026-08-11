import axiosInstance from "./axiosConfig";
import { generateSlug } from "../utils/slugUtils";
import initialCategories from "../data/categories.json";
// Usa datos mock en memoria mientras no exista el backend real.
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ?? `mock-${Date.now()}`;

const pickCategoryFields = (data) => ({
  name: data.name,
  slug: data.slug || generateSlug(data.name),
  is_active: data.is_active ?? true,
});

const extractList = (data) =>
  Array.isArray(data) ? data : (data?.data ?? data?.rows ?? []);

// Inicializamos mockCategories a partir del archivo en /data
// Mantiene el estado en memoria para permitir altas/bajas/modificaciones en local.
let mockCategories = Array.isArray(initialCategories)
  ? initialCategories.map((cat, idx) => ({
      id: cat.id ?? `cat-${idx + 1}`,
      name: cat.name || cat.categoria || cat,
      slug: cat.slug || generateSlug(cat.name || cat.categoria || cat),
      is_active: cat.is_active ?? true,
      created_at: cat.created_at || new Date().toISOString(),
      updated_at: cat.updated_at || new Date().toISOString(),
    }))
  : [];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCategories = async () => {
  if (USE_MOCK) {
    await delay();
    return [...mockCategories];
  }
  const { data } = await axiosInstance.get("/categories");
  return extractList(data);
};

export const createCategory = async (categoryData) => {
  if (USE_MOCK) {
    await delay();
    const newCategory = {
      id: generateId(),
      ...pickCategoryFields(categoryData),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockCategories.push(newCategory);
    return newCategory;
  }
  const { data } = await axiosInstance.post("/categories", categoryData);
  return data;
};

export const updateCategory = async (id, categoryData) => {
  if (USE_MOCK) {
    await delay();
    const updatedAt = new Date().toISOString();
    let updatedCategory = null;
    mockCategories = mockCategories.map((cat) => {
      if (String(cat.id) !== String(id)) return cat;
      updatedCategory = {
        ...cat,
        ...pickCategoryFields(categoryData),
        updated_at: updatedAt,
      };
      return updatedCategory;
    });
    return updatedCategory;
  }
  const { data } = await axiosInstance.put(`/categories/${id}`, categoryData);
  return data;
};

export const deleteCategory = async (id) => {
  if (USE_MOCK) {
    await delay();
    mockCategories = mockCategories.filter(
      (cat) => String(cat.id) !== String(id),
    );
    return { success: true };
  }
  const { data } = await axiosInstance.delete(`/categories/${id}`);
  return data;
};
