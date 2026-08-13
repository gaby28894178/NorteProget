import axiosInstance from "./axiosConfig";
import { generateSlug } from "../utils/slugUtils";
import initialProducts from "../data/products.json";

// Usa datos mock en memoria mientras no exista el backend real.
// El único punto donde se decide entre mock y API real es este flag.
const USE_MOCK =
  import.meta.env.VITE_USE_MOCK === "true" || !import.meta.env.VITE_API_URL;

const generateId = () =>
  globalThis.crypto?.randomUUID?.() ?? `mock-${Date.now()}`;

const toISO = (value) => value || new Date().toISOString();

const normalizeVariant = (variant, productId, now) => ({
  id: variant.id ?? generateId(),
  product_id: productId,
  sku: variant.sku,
  size: variant.size || null,
  color: variant.color || null,
  stock: Number(variant.stock) || 0,
  is_default: Boolean(variant.is_default),
  created_at: toISO(variant.created_at || now),
  updated_at: toISO(variant.updated_at || now),
});

// El public_id es una referencia interna de Cloudinary. Se genera
// automáticamente desde el slug del producto: norte/products/<slug>/<orden>.
const normalizeImage = (image, productId, slug, now) => ({
  id: image.id ?? generateId(),
  product_id: productId,
  public_id: image.public_id || `norte/products/${slug}/${image.display_order}`,
  secure_url: image.secure_url,
  display_order: Number(image.display_order) || 1,
  created_at: toISO(image.created_at || now),
});

const normalizeProduct = (data) => {
  const now = new Date().toISOString();
  const id = data.id ?? generateId();
  const slug = data.slug || generateSlug(data.name);

  return {
    id,
    category_id: data.category_id,
    name: data.name,
    slug,
    description: data.description || null,
    current_price: Number(data.current_price),
    status: data.status || "PUBLISHED",
    created_at: toISO(data.created_at || now),
    updated_at: toISO(data.updated_at || now),
    variants: (Array.isArray(data.variants) ? data.variants : []).map(
      (v) => normalizeVariant(v, id, now),
    ),
    images: (Array.isArray(data.images) ? data.images : []).map((img) =>
      normalizeImage(img, id, slug, now),
    ),
  };
};

const extractList = (data) =>
  Array.isArray(data) ? data : (data?.data ?? data?.rows ?? []);

// Inicializamos mockProducts a partir del archivo en /data.
// Mantiene el estado en memoria para permitir altas/bajas/modificaciones en local.
const seedFromJson = () =>
  Array.isArray(initialProducts)
    ? initialProducts.map((product) => normalizeProduct(product))
    : [];

let mockProducts = seedFromJson();

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProducts = async () => {
  if (USE_MOCK) {
    await delay();
    return [...mockProducts];
  }
  const { data } = await axiosInstance.get("/products");
  return extractList(data);
};

export const createProduct = async (productData) => {
  if (USE_MOCK) {
    await delay();
    const newProduct = normalizeProduct(productData);
    mockProducts = [newProduct, ...mockProducts];
    return newProduct;
  }
  const { data } = await axiosInstance.post("/products", productData);
  return data;
};

export const updateProduct = async (id, productData) => {
  if (USE_MOCK) {
    await delay();
    let updatedProduct = null;
    mockProducts = mockProducts.map((product) => {
      if (String(product.id) !== String(id)) return product;
      updatedProduct = normalizeProduct({ ...productData, id });
      return updatedProduct;
    });
    return updatedProduct;
  }
  const { data } = await axiosInstance.put(`/products/${id}`, productData);
  return data;
};

export const deleteProduct = async (id) => {
  if (USE_MOCK) {
    await delay();
    mockProducts = mockProducts.filter(
      (product) => String(product.id) !== String(id),
    );
    return { success: true };
  }
  const { data } = await axiosInstance.delete(`/products/${id}`);
  return data;
};