import axiosInstance from "./axiosConfig";
import initialCategories from "../data/categories.json";

// Usa datos mock en memoria mientras no exista el backend real.
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ?? `mock-${Date.now()}`;

const pickCategoryFields = (data) => ({
  name: data.name,
  is_active: data.is_active ?? true,
});

// Extrae la lista de datos de la respuesta del backend.
// El backend devuelve: { success, data: [...], pagination: {...} }
const extractList = (response) => {
  if (!response) return [];
  const payload = response.data ?? response;
  return Array.isArray(payload) ? payload : (payload.data ?? payload.rows ?? []);
};

const extractPagination = (response) => {
  if (!response) return null;
  const payload = response.data ?? response;
  return payload.pagination ?? null;
};

// Simula paginación en modo mock
const mockPaginate = (list, { page = 1, limit = 10, search = "", is_active } = {}) => {
  let filtered = [...list];

  if (search) {
    const term = search.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    filtered = filtered.filter((cat) => {
      const name = cat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return name.includes(term);
    });
  }

  if (is_active !== undefined && is_active !== null && is_active !== "") {
    const active = is_active === true || is_active === "true";
    filtered = filtered.filter((cat) => cat.is_active === active);
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  return {
    data,
    pagination: { page, limit, total, totalPages },
  };
};

// Inicializamos mockCategories a partir del archivo en /data
let mockCategories = Array.isArray(initialCategories)
  ? initialCategories.map((cat, idx) => ({
      id: cat.id ?? `cat-${idx + 1}`,
      name: cat.name || cat.categoria || cat,
      slug: cat.slug || "",
      is_active: cat.is_active ?? true,
      created_at: cat.created_at || new Date().toISOString(),
      updated_at: cat.updated_at || new Date().toISOString(),
    }))
  : [];

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ─── GET /categories ───────────────────────────────────────
// Acepta: { page, limit, search, is_active }
// Retorna: { data: [...], pagination: { page, limit, total, totalPages } }
export const getCategories = async ({ page = 1, limit = 10, search = "", is_active } = {}) => {
  if (USE_MOCK) {
    await delay();
    return mockPaginate(mockCategories, { page, limit, search, is_active });
  }
  const params = { page, limit };
  if (search) params.search = search;
  if (is_active !== undefined && is_active !== null && is_active !== "") {
    params.is_active = is_active;
  }
  const response = await axiosInstance.get("/categories", { params });
  return {
    data: extractList(response),
    pagination: extractPagination(response),
  };
};

// ─── GET /categories/active ────────────────────────────────
// Retorna solo categorías activas (para catálogo público)
export const getActiveCategories = async () => {
  if (USE_MOCK) {
    await delay();
    return mockCategories.filter((cat) => cat.is_active);
  }
  const response = await axiosInstance.get("/categories/active");
  return extractList(response);
};

// ─── GET /categories/:id ───────────────────────────────────
export const getCategoryById = async (id) => {
  if (USE_MOCK) {
    await delay();
    return mockCategories.find((cat) => String(cat.id) === String(id)) ?? null;
  }
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data?.data ?? response.data ?? null;
};

// ─── POST /categories ──────────────────────────────────────
export const createCategory = async (categoryData) => {
  if (USE_MOCK) {
    await delay();
    const name = categoryData.name;
    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const newCategory = {
      id: generateId(),
      name,
      slug,
      is_active: categoryData.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockCategories.push(newCategory);
    return newCategory;
  }
  const { data } = await axiosInstance.post("/categories", categoryData);
  return data?.data ?? data;
};

// ─── PUT /categories/:id ───────────────────────────────────
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
  return data?.data ?? data;
};

// ─── PATCH /categories/:id/status ──────────────────────────
// Activa/desactiva una categoría sin enviar todos los campos
export const updateCategoryStatus = async (id, is_active) => {
  if (USE_MOCK) {
    await delay();
    let updatedCategory = null;
    mockCategories = mockCategories.map((cat) => {
      if (String(cat.id) !== String(id)) return cat;
      updatedCategory = { ...cat, is_active, updated_at: new Date().toISOString() };
      return updatedCategory;
    });
    return updatedCategory;
  }
  const { data } = await axiosInstance.patch(`/categories/${id}/status`, { is_active });
  return data?.data ?? data;
};

// ─── DELETE /categories/:id ────────────────────────────────
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
