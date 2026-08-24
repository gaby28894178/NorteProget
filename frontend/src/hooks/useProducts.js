import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";
import { getCategories } from "../api/categoryApi";
import { getApiErrorMessage } from "../utils/apiErrors";

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
          getCategories(),
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
    products,
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
  };
};
