import axiosInstance from "./axiosConfig";

// Usa datos mock en memoria mientras no exista el backend real.
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ?? `mock-${Date.now()}`;

const pickCategoryFields = (data) => ({
  name: data.name,
  slug: data.slug,
  is_active: data.is_active ?? true,
});

const extractList = (data) =>
  Array.isArray(data) ? data : (data?.data ?? data?.rows ?? []);

// MockData para pruebas de Categorias
let mockCategories = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    name: "Remeras y Musculosas",
    slug: "remeras-y-musculosas",
    is_active: true,
    created_at: "2026-08-01T10:00:00.000Z",
    updated_at: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "c9bf9e57-1685-4c89-bafb-ff5af830be8a",
    name: "Buzos y Camperas",
    slug: "buzos-y-camperas",
    is_active: true,
    created_at: "2026-08-01T10:00:00.000Z",
    updated_at: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "3b8829f0-293e-4b2a-a92d-94d3fd4d6123",
    name: "Pantalones y Jeans",
    slug: "pantalones-y-jeans",
    is_active: true,
    created_at: "2026-08-01T10:00:00.000Z",
    updated_at: "2026-08-01T10:00:00.000Z",
  },
  {
    id: "e2a9b311-8201-4435-bc44-1296d11e8a45",
    name: "Accesorios de Diseño",
    slug: "accesorios-de-diseno",
    is_active: true,
    created_at: "2026-08-01T10:00:00.000Z",
    updated_at: "2026-08-01T10:00:00.000Z",
  },
];

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
      if (cat.id !== id) return cat;
      updatedCategory = { ...cat, ...pickCategoryFields(categoryData), updated_at: updatedAt };
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
    mockCategories = mockCategories.filter((cat) => cat.id !== id);
    return { success: true };
  }
  const { data } = await axiosInstance.delete(`/categories/${id}`);
  return data;
};
