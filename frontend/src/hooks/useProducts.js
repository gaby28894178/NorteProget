import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";
import { getCategories } from "../api/categoryApi";
import { getApiErrorMessage } from "../utils/apiErrors";

// Para el selector de categorías del formulario de productos,
// necesitamos todas las categorías activas sin paginación.
const getAllCategories = async () => {
  const result = await getCategories({ page: 1, limit: 100, search: "" });
  return result.data;
};

const normalizeText = (text) =>
  (text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del Formulario de creación/edición
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Estado de la vista de detalle de producto (solo lectura, sin edición)
  const [viewingProduct, setViewingProduct] = useState(null);

  // Estilos del diálogo de confirmación de borrado
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ─── Estados de filtros ─────────────────────────────────
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Debounce de búsqueda (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError(getApiErrorMessage(err, "No se pudieron cargar los productos."));
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial en el montaje (setState solo en callbacks asíncronos)
  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getAllCategories(),
        ]);
        if (isMounted) {
          setProducts(productData);
          setCategories(categoryData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error al cargar datos:", err);
          setError(getApiErrorMessage(err, "No se pudieron cargar los datos."));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAll();

    return () => {
      isMounted = false;
    };
  }, []);

  // ─── Productos filtrados y ordenados ──────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filtro por búsqueda (nombre del producto o nombre de categoría)
    if (search) {
      const term = normalizeText(search);
      result = result.filter((product) => {
        const nameMatch = normalizeText(product.name).includes(term);
        const catName = categories.find((c) => c.id === product.category_id)?.name ?? "";
        const catMatch = normalizeText(catName).includes(term);
        return nameMatch || catMatch;
      });
    }

    // Filtro por estado
    if (statusFilter) {
      result = result.filter((product) => product.status === statusFilter);
    }

    // Ordenamiento
    const dir = sortOrder === "asc" ? 1 : -1;
    result.sort((a, b) => {
      let valA, valB;
      if (sortBy === "current_price") {
        valA = Number(a.current_price) || 0;
        valB = Number(b.current_price) || 0;
        return (valA - valB) * dir;
      } else if (sortBy === "stock") {
        const stockA = Array.isArray(a.variants)
          ? a.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
          : 0;
        const stockB = Array.isArray(b.variants)
          ? b.variants.reduce((acc, v) => acc + (v.stock || 0), 0)
          : 0;
        return (stockA - stockB) * dir;
      } else if (sortBy === "variants") {
        const countA = Array.isArray(a.variants) ? a.variants.length : 0;
        const countB = Array.isArray(b.variants) ? b.variants.length : 0;
        return (countA - countB) * dir;
      } else if (sortBy === "created_at") {
        valA = new Date(a.created_at).getTime();
        valB = new Date(b.created_at).getTime();
        return (valA - valB) * dir;
      }
      return 0;
    });

    return result;
  }, [products, categories, search, statusFilter, sortBy, sortOrder]);

  // ─── Sort ───────────────────────────────────────────────
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  // ─── Limpiar filtros ───────────────────────────────────
  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setStatusFilter("");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  const hasActiveFilters = search || statusFilter;

  const handleOpenCreate = () => {
    setViewingProduct(null);
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenView = (product) => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setViewingProduct(product);
  };

  const handleOpenEdit = (product) => {
    // Manta la referencia al producto para poder volver a su detalle
    // con los datos actualizados tras guardar
    setViewingProduct(product);
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleCloseView = () => {
    setViewingProduct(null);
  };

  // Compara los datos del formulario con los del producto original para determinar si hubo cambios.
  const hasChanges = (formData) => {
    const original = editingProduct;
    if (!original) return formData.name?.trim()?.length > 0;

    if (
      String(original.category_id ?? "") !== String(formData.category_id ?? "")
    )
      return true;
    if ((original.name ?? "") !== (formData.name ?? "")) return true;
    if ((original.description ?? "") !== (formData.description ?? ""))
      return true;
    if (Number(original.current_price) !== Number(formData.current_price))
      return true;
    if ((original.status ?? "PUBLISHED") !== (formData.status ?? "PUBLISHED"))
      return true;

    const origVariants = Array.isArray(original.variants)
      ? original.variants
      : [];
    const formVariants = Array.isArray(formData.variants)
      ? formData.variants
      : [];
    if (origVariants.length !== formVariants.length) return true;
    for (let i = 0; i < origVariants.length; i++) {
      const a = origVariants[i];
      const b = formVariants[i];
      if ((a.size ?? "") !== (b.size ?? "")) return true;
      if ((a.color ?? "") !== (b.color ?? "")) return true;
      if (Number(a.stock ?? 0) !== Number(b.stock ?? 0)) return true;
      if (Boolean(a.is_default) !== Boolean(b.is_default)) return true;
    }

    const origImages = Array.isArray(original.images) ? original.images : [];
    const formImages = Array.isArray(formData.images) ? formData.images : [];
    if (origImages.length !== formImages.length) return true;
    for (let i = 0; i < origImages.length; i++) {
      const a = origImages[i];
      const b = formImages[i];
      if ((a.secure_url ?? "") !== (b.secure_url ?? "")) return true;
      if (Number(a.display_order) !== Number(b.display_order)) return true;
    }

    return false;
  };

  const handleSave = async (formData) => {
    // Si se trata de una edición y no hubo cambios reales, no guardamos
    // (evita que Enter o un click accidental "guarde" y cierre el editor).
    if (editingProduct && !hasChanges(formData)) {
      toast.info("No hay cambios para guardar.");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success("Producto actualizado correctamente.");
      } else {
        await createProduct(formData);
        toast.success("Producto creado correctamente.");
      }
      handleCloseForm();
      await fetchProducts();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      toast.error(getApiErrorMessage(err, "No se pudo guardar el producto."));
    }
  };

  const handleDeleteRequest = (product) => {
    setDeleteTarget(product);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      toast.success("Producto eliminado correctamente.");
      setDeleteTarget(null);
      await fetchProducts();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      toast.error(getApiErrorMessage(err, "No se pudo eliminar el producto."));
    } finally {
      setDeleting(false);
    }
  };

  return {
    products: filteredProducts,
    allProductsCount: products.length,
    categories,
    loading,
    error,
    isFormOpen,
    editingProduct,
    viewingProduct,
    handleOpenCreate,
    handleOpenView,
    handleOpenEdit,
    handleCloseForm,
    handleCloseView,
    handleSave,
    deleteTarget,
    deleting,
    handleDeleteRequest,
    handleDeleteCancel,
    handleDeleteConfirm,
    // Filtros
    searchInput,
    setSearchInput,
    statusFilter,
    setStatusFilter,
    sortBy,
    sortOrder,
    handleSort,
    hasActiveFilters,
    clearFilters,
  };
};
