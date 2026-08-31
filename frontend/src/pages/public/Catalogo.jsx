import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { FaSlidersH } from "react-icons/fa";

import { getPublishedProducts } from "../../api/productApi";
import { getActiveCategories } from "../../api/categoryApi";
import {
  trackViewItemList,
  trackViewSearchResults,
} from "../../utils/analytics";
import { FilterSidebar } from "../../components/public/FilterSidebar";
import ProductCard from "../../components/public/ProductCard";

const Catalogo = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // =========================
  // DATOS
  // =========================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getPublishedProducts(),
          getActiveCategories(),
        ]);
        if (isMounted) {
          setProducts(productData);
          setCategories(categoryData);
        }
      } catch (err) {
        console.error("Error al cargar catálogo:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================
  // Resuelven category_id → nombre,
  // derivan colores/talles de variants[],
  // extraen imagen principal de images[]
  // =========================

  const enrichedProducts = useMemo(() => {
    return products.map((product) => {
      const category = categories.find((c) => c.id === product.category_id);

      const colors = [
        ...new Set(
          (product.variants || []).map((v) => v.color).filter(Boolean),
        ),
      ];

      const sizes = [
        ...new Set((product.variants || []).map((v) => v.size).filter(Boolean)),
      ];

      const sortedImages = [...(product.images || [])].sort(
        (a, b) => a.display_order - b.display_order,
      );
      const imageUrl = sortedImages[0]?.secure_url || "";

      return {
        ...product,
        categoryName: category?.name || "",
        colors,
        sizes,
        imageUrl,
      };
    });
  }, [products, categories]);

  // =========================
  // BÚSQUEDA
  // =========================

  const busqueda = searchParams.get("buscar")?.trim() || "";

  // =========================
  // CATEGORÍA DESDE URL
  // =========================

  const categoriaUrl = searchParams.get("categoria")?.trim() || "Todas";

  // Normalizamos la búsqueda
  // para ignorar mayúsculas y acentos
  const normalizarTexto = (texto) => {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const busquedaNormalizada = normalizarTexto(busqueda);

  // =========================
  // FILTROS
  // =========================

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState(categoriaUrl);

  const [coloresSeleccionados, setColoresSeleccionados] = useState([]);

  const [tallesSeleccionados, setTallesSeleccionados] = useState([]);

  // Drawer de filtros en móvil (solo < lg)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const closeFilters = () => setIsFiltersOpen(false);

  // Bloquea el scroll del fondo mientras el drawer esté abierto
  // y permite cerrarlo con la tecla Escape.
  useEffect(() => {
    if (!isFiltersOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsFiltersOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFiltersOpen]);

  // =========================
  // SINCRONIZAR CATEGORÍA
  // CON LA URL
  // =========================

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategoriaSeleccionada(categoriaUrl);
  }, [categoriaUrl]);

  // =========================
  // CATEGORÍAS
  // =========================

  const categorias = [
    "Todas",
    ...new Set(enrichedProducts.map((product) => product.categoryName)),
  ];

  // =========================
  // COLORES
  // =========================

  const colores = [
    ...new Set(enrichedProducts.flatMap((product) => product.colors || [])),
  ];

  // =========================
  // TALLES
  // =========================

  const talles = [
    ...new Set(enrichedProducts.flatMap((product) => product.sizes || [])),
  ];

  // =========================
  // CAMBIAR CATEGORÍA
  // =========================

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  // =========================
  // CAMBIAR COLOR
  // =========================

  const handleColorChange = (color) => {
    setColoresSeleccionados((currentColors) =>
      currentColors.includes(color)
        ? currentColors.filter((item) => item !== color)
        : [...currentColors, color],
    );
  };

  // =========================
  // CAMBIAR TALLE
  // =========================

  const handleTalleChange = (talle) => {
    setTallesSeleccionados((currentSizes) =>
      currentSizes.includes(talle)
        ? currentSizes.filter((item) => item !== talle)
        : [...currentSizes, talle],
    );
  };

  // =========================
  // FILTRAR PRODUCTOS
  // =========================

  const productosFiltrados = enrichedProducts.filter((product) => {
    // =========================
    // TEXTO DEL PRODUCTO
    // =========================

    const nombre = normalizarTexto(product.name);

    const categoria = normalizarTexto(product.categoryName);

    const descripcion = normalizarTexto(product.description);

    // =========================
    // COLORES DEL PRODUCTO
    // =========================

    const coloresProducto = (product.colors || []).map((color) =>
      normalizarTexto(color),
    );

    // =========================
    // TALLES DEL PRODUCTO
    // =========================

    const tallesProducto = (product.sizes || []).map((talle) =>
      normalizarTexto(talle),
    );

    // =========================
    // BÚSQUEDA GENERAL
    // =========================

    const coincideBusqueda =
      busquedaNormalizada === "" ||
      nombre.includes(busquedaNormalizada) ||
      categoria.includes(busquedaNormalizada) ||
      descripcion.includes(busquedaNormalizada) ||
      coloresProducto.some((color) => color.includes(busquedaNormalizada)) ||
      tallesProducto.some((talle) => talle === busquedaNormalizada);

    // =========================
    // CATEGORÍA
    // =========================

    const coincideCategoria =
      categoriaSeleccionada === "Todas" ||
      product.categoryName === categoriaSeleccionada;

    // =========================
    // COLOR
    // =========================

    const coincideColor =
      coloresSeleccionados.length === 0 ||
      coloresSeleccionados.some((color) => product.colors?.includes(color));

    // =========================
    // TALLE
    // =========================

    const coincideTalle =
      tallesSeleccionados.length === 0 ||
      tallesSeleccionados.some((talle) => product.sizes?.includes(talle));

    // =========================
    // RESULTADO FINAL
    // =========================

    return (
      coincideBusqueda && coincideCategoria && coincideColor && coincideTalle
    );
  });

  // =========================
  // LIMPIAR FILTROS
  // =========================

  const limpiarFiltros = () => {
    setCategoriaSeleccionada("Todas");
    setColoresSeleccionados([]);
    setTallesSeleccionados([]);

    navigate("/catalogo");
  };

  // =========================
  // FILTROS ACTIVOS
  // =========================

  const hayFiltrosActivos =
    busqueda !== "" ||
    categoriaSeleccionada !== "Todas" ||
    coloresSeleccionados.length > 0 ||
    tallesSeleccionados.length > 0;

  // Cantidad de filtros aplicados (para el badge del botón en móvil)
  const filtrosActivosCount =
    (categoriaSeleccionada !== "Todas" ? 1 : 0) +
    coloresSeleccionados.length +
    tallesSeleccionados.length;

  // =========================
  // ANALYTICS — VISTA DE LISTADO
  // =========================

  useEffect(() => {
    const timer = setTimeout(() => {
      if (busqueda) {
        trackViewSearchResults({
          search: busqueda,
          count: productosFiltrados.length,
        });
      }

      trackViewItemList({
        search: busqueda,
        category: categoriaSeleccionada,
        count: productosFiltrados.length,
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [
    busqueda,
    categoriaSeleccionada,
    coloresSeleccionados,
    tallesSeleccionados,
    productosFiltrados.length,
  ]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black">
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          <div className="py-20 text-center">
            <p className="text-sm text-gray-500">Cargando productos...</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-white text-black">
        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
          {/* =========================
              ENCABEZADO
          ========================== */}

          <div className="mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-norte-mustard">
              NORTE
            </p>

            <h1 className="text-[28px] font-bold tracking-tight sm:text-[36px] lg:text-[48px]">
              {busqueda
                ? `Resultados para "${busqueda}"`
                : categoriaSeleccionada !== "Todas"
                  ? categoriaSeleccionada
                  : "Productos"}
            </h1>
          </div>

          <div className="flex flex-col gap-6 lg:flex-row lg:gap-10">
            {/* =========================
                FILTROS — DESKTOP
                (fijos en el sidebar, >= lg)
            ========================== */}

            <aside className="hidden w-44 shrink-0 lg:block">
              <FilterSidebar
                categorias={categorias}
                colores={colores}
                talles={talles}
                categoriaSeleccionada={categoriaSeleccionada}
                coloresSeleccionados={coloresSeleccionados}
                tallesSeleccionados={tallesSeleccionados}
                handleCategoriaChange={handleCategoriaChange}
                handleColorChange={handleColorChange}
                handleTalleChange={handleTalleChange}
                limpiarFiltros={limpiarFiltros}
                hayFiltrosActivos={hayFiltrosActivos}
              />
            </aside>

            {/* =========================
                PRODUCTOS
            ========================== */}

            <section className="flex-1">
              <div className="mb-6 flex items-center justify-between gap-4">
                <p className="text-xs text-gray-500">
                  {productosFiltrados.length}{" "}
                  {productosFiltrados.length === 1 ? "producto" : "productos"}
                </p>

                {/* Botón que abre el drawer de filtros (solo móvil) */}
                <button
                  type="button"
                  onClick={() => setIsFiltersOpen(true)}
                  className="inline-flex items-center gap-2 rounded-btn border border-norte-stone bg-white px-4 py-2 text-xs font-medium text-norte-dark transition hover:border-norte-mustard hover:text-norte-mustard lg:hidden"
                >
                  <FaSlidersH className="text-xs" />
                  Filtrar
                  {filtrosActivosCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-norte-mustard px-1 text-[9px] font-semibold text-white">
                      {filtrosActivosCount}
                    </span>
                  )}
                </button>
              </div>

              {/* =========================
                  GRID
              ========================== */}

              {productosFiltrados.length > 0 && (
                <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {productosFiltrados.map(
                    (product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    )
                  )}
                </div>
              )}

              {/* =========================
                  SIN RESULTADOS
              ========================== */}

              {productosFiltrados.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-sm text-gray-500">
                    No encontramos productos con los filtros seleccionados.
                  </p>

                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="mt-4 text-xs font-medium text-norte-mustard hover:underline"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* =========================
              FILTROS — MÓVIL
              (drawer superpuesto con blur, < lg)
          ========================== */}

          <div
            className={`fixed inset-0 z-50 lg:hidden ${
              isFiltersOpen ? "" : "pointer-events-none"
            }`}
          >
            {/* Backdrop con blur del contenido de atrás */}
            <div
              className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
                isFiltersOpen ? "opacity-100" : "opacity-0"
              }`}
              onClick={closeFilters}
            />

            {/* Panel lateral */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Filtros del catálogo"
              inert={!isFiltersOpen}
              className={`absolute inset-y-0 left-0 w-72 max-w-[85vw] transform overflow-y-auto bg-white p-6 shadow-2xl transition-transform duration-300 ${
                isFiltersOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <FilterSidebar
                categorias={categorias}
                colores={colores}
                talles={talles}
                categoriaSeleccionada={categoriaSeleccionada}
                coloresSeleccionados={coloresSeleccionados}
                tallesSeleccionados={tallesSeleccionados}
                handleCategoriaChange={handleCategoriaChange}
                handleColorChange={handleColorChange}
                handleTalleChange={handleTalleChange}
                limpiarFiltros={limpiarFiltros}
                hayFiltrosActivos={hayFiltrosActivos}
                onClose={closeFilters}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Catalogo;
