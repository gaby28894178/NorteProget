import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";
import { getApiErrorMessage } from "../utils/apiErrors";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Función para recargar la lista manualmente (por ejemplo, después de crear/editar)
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setError(getApiErrorMessage(err, "No se pudieron cargar las categorías."));
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial en el montaje (setState solo en callbacks asíncronos)
  useEffect(() => {
    let isMounted = true;

    getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error("Error al cargar categorías:", err);
          setError(getApiErrorMessage(err, "No se pudieron cargar las categorías."));
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
        toast.success("Categoría actualizada correctamente.");
      } else {
        await createCategory(formData);
        toast.success("Categoría creada correctamente.");
      }
      handleCloseModal();
      await fetchCategories();
    } catch (err) {
      console.error("Error al guardar categoría:", err);
      toast.error(getApiErrorMessage(err, "No se pudo guardar la categoría."));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success("Categoría eliminada correctamente.");
      await fetchCategories();
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      toast.error(getApiErrorMessage(err, "No se pudo eliminar la categoría."));
    }
  };

  return {
    categories,
    loading,
    error,
    isModalOpen,
    editingCategory,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  };
};
