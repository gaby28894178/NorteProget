import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";
import { getApiErrorMessage } from "../utils/apiErrors";

const PAGE_SIZE = 10;

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(null);

  const [searchInput, setSearchInput] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Forzar recarga sin cambiar page/search
  const [refreshKey, setRefreshKey] = useState(0);
  const refetch = () => setRefreshKey((k) => k + 1);

  // Carga de datos: usa un async function interna para no llamar setState síncrono
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const result = await getCategories({ page, limit: PAGE_SIZE, search });
        if (isMounted) {
          setCategories(result.data);
          setPagination(result.pagination);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error al cargar categorías:", err);
          setError(getApiErrorMessage(err, "No se pudieron cargar las categorías."));
          setLoading(false);
        }
      }
    }

    load();
    return () => { isMounted = false; };
  }, [page, search, refreshKey]);

  // Debounce de búsqueda (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

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
      refetch();
    } catch (err) {
      console.error("Error al guardar categoría:", err);
      toast.error(getApiErrorMessage(err, "No se pudo guardar la categoría."));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      toast.success("Categoría eliminada correctamente.");
      if (categories.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refetch();
      }
    } catch (err) {
      console.error("Error al eliminar categoría:", err);
      toast.error(getApiErrorMessage(err, "No se pudo eliminar la categoría."));
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return {
    categories,
    loading,
    error,
    isModalOpen,
    editingCategory,
    page,
    pagination,
    searchInput,
    setSearchInput,
    handlePageChange,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSave,
    handleDelete,
  };
};
