import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import products from "../../data/products";
import {
  trackViewItemList,
  trackViewSearchResults,
} from "../../utils/analytics";


const Catalogo = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // =========================
  // BÚSQUEDA
  // =========================

  const busqueda =
    searchParams.get("buscar")?.trim() || "";

  // =========================
  // CATEGORÍA DESDE URL
  // =========================

  const categoriaUrl =
    searchParams.get("categoria")?.trim() || "Todas";

  // Normalizamos la búsqueda
  // para ignorar mayúsculas y acentos
  const normalizarTexto = (texto) => {
    return String(texto || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  const busquedaNormalizada =
    normalizarTexto(busqueda);

  // =========================
  // FILTROS
  // =========================

  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState(categoriaUrl);

  const [coloresSeleccionados, setColoresSeleccionados] =
    useState([]);

  const [tallesSeleccionados, setTallesSeleccionados] =
    useState([]);

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
    ...new Set(
      products.map((product) => product.category)
    ),
  ];

  // =========================
  // COLORES
  // =========================

  const colores = [
    ...new Set(
      products.flatMap(
        (product) => product.colors || []
      )
    ),
  ];

  // =========================
  // TALLES
  // =========================

  const talles = [
    ...new Set(
      products.flatMap(
        (product) => product.sizes || []
      )
    ),
  ];

  // =========================
  // CAMBIAR COLOR
  // =========================

  const handleColorChange = (color) => {
    setColoresSeleccionados((currentColors) =>
      currentColors.includes(color)
        ? currentColors.filter(
            (item) => item !== color
          )
        : [...currentColors, color]
    );
  };

  // =========================
  // CAMBIAR TALLE
  // =========================

  const handleTalleChange = (talle) => {
    setTallesSeleccionados((currentSizes) =>
      currentSizes.includes(talle)
        ? currentSizes.filter(
            (item) => item !== talle
          )
        : [...currentSizes, talle]
    );
  };

  // =========================
  // FILTRAR PRODUCTOS
  // =========================

  const productosFiltrados = products.filter(
    (product) => {

      // =========================
      // TEXTO DEL PRODUCTO
      // =========================

      const nombre = normalizarTexto(
        product.name
      );

      const categoria = normalizarTexto(
        product.category
      );

      const descripcion = normalizarTexto(
        product.description
      );

      // =========================
      // COLORES DEL PRODUCTO
      // =========================

      const coloresProducto =
        (product.colors || []).map(
          (color) =>
            normalizarTexto(color)
        );

      // =========================
      // TALLES DEL PRODUCTO
      // =========================

      const tallesProducto =
        (product.sizes || []).map(
          (talle) =>
            normalizarTexto(talle)
        );

      // =========================
      // BÚSQUEDA GENERAL
      // =========================

      const coincideBusqueda =
        busquedaNormalizada === "" ||
        nombre.includes(busquedaNormalizada) ||
        categoria.includes(busquedaNormalizada) ||
        descripcion.includes(busquedaNormalizada) ||
        coloresProducto.some((color) =>
          color.includes(busquedaNormalizada)
        ) ||
        tallesProducto.some((talle) =>
          talle === busquedaNormalizada
        );

      // =========================
      // CATEGORÍA
      // =========================

      const coincideCategoria =
        categoriaSeleccionada === "Todas" ||
        product.category ===
          categoriaSeleccionada;

      // =========================
      // COLOR
      // =========================

      const coincideColor =
        coloresSeleccionados.length === 0 ||
        coloresSeleccionados.some((color) =>
          product.colors?.includes(color)
        );

      // =========================
      // TALLE
      // =========================

      const coincideTalle =
        tallesSeleccionados.length === 0 ||
        tallesSeleccionados.some((talle) =>
          product.sizes?.includes(talle)
        );

      // =========================
      // RESULTADO FINAL
      // =========================

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideColor &&
        coincideTalle
      );
    }
  );

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
  // COLOR VISUAL
  // =========================

  const obtenerColorClase = (color) => {
    switch (color) {
      case "Negro":
        return "bg-black";

      case "Blanco":
        return "bg-white";

      case "Nude":
        return "bg-[#d8b9a0]";

      case "Camel":
        return "bg-[#b88a5a]";

      case "Rojo":
        return "bg-red-600";

      case "Azul":
        return "bg-blue-600";

      case "Verde":
        return "bg-green-700";

      default:
        return "bg-gray-300";
    }
  };

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

            <h1 className="text-3xl font-normal tracking-tight">
              {busqueda
                ? `Resultados para "${busqueda}"`
                : categoriaSeleccionada !== "Todas"
                  ? categoriaSeleccionada
                  : "Productos"}
            </h1>

          </div>

          <div className="flex flex-col gap-10 lg:flex-row">

            {/* =========================
                SIDEBAR
            ========================== */}

            <aside className="w-full shrink-0 lg:w-44">

              <div className="flex items-center justify-between">

                <h2 className="text-sm font-medium">
                  Filtrar por
                </h2>

                {hayFiltrosActivos && (
                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="text-[10px] text-norte-mustard hover:underline"
                  >
                    Limpiar
                  </button>
                )}

              </div>

              {/* =========================
                  CATEGORÍAS
              ========================== */}

              <div className="border-b border-gray-200 py-6">

                <h3 className="mb-5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                  Categorías
                </h3>

                <div className="flex flex-col gap-3">

                  {categorias.map(
                    (categoria) => (
                      <button
                        key={categoria}
                        type="button"
                        onClick={() =>
                          setCategoriaSeleccionada(
                            categoria
                          )
                        }
                        className={`text-left text-xs transition ${
                          categoriaSeleccionada ===
                          categoria
                            ? "font-semibold text-norte-mustard"
                            : "text-gray-700 hover:text-norte-mustard"
                        }`}
                      >
                        {categoria}
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* =========================
                  COLORES
              ========================== */}

              <div className="border-b border-gray-200 py-6">

                <h3 className="mb-5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                  Color
                </h3>

                <div className="flex flex-col gap-3">

                  {colores.map(
                    (color) => (
                      <label
                        key={color}
                        className="flex cursor-pointer items-center gap-3 text-xs text-gray-700"
                      >

                        <input
                          type="checkbox"
                          checked={coloresSeleccionados.includes(
                            color
                          )}
                          onChange={() =>
                            handleColorChange(
                              color
                            )
                          }
                          className="h-3 w-3 rounded border-gray-400 accent-norte-mustard"
                        />

                        <span>
                          {color}
                        </span>

                      </label>
                    )
                  )}

                </div>

              </div>

              {/* =========================
                  TALLES
              ========================== */}

              <div className="py-6">

                <h3 className="mb-5 text-[10px] font-medium uppercase tracking-wide text-gray-500">
                  Talles
                </h3>

                <div className="flex flex-col gap-3">

                  {talles.map(
                    (talle) => (
                      <label
                        key={talle}
                        className="flex cursor-pointer items-center gap-3 text-xs text-gray-700"
                      >

                        <input
                          type="checkbox"
                          checked={tallesSeleccionados.includes(
                            talle
                          )}
                          onChange={() =>
                            handleTalleChange(
                              talle
                            )
                          }
                          className="h-3 w-3 rounded border-gray-400 accent-norte-mustard"
                        />

                        <span>
                          {talle}
                        </span>

                      </label>
                    )
                  )}

                </div>

              </div>

            </aside>

            {/* =========================
                PRODUCTOS
            ========================== */}

            <section className="flex-1">

              <div className="mb-6 flex items-center justify-between">

                <p className="text-xs text-gray-500">
                  {productosFiltrados.length}{" "}
                  {productosFiltrados.length === 1
                    ? "producto"
                    : "productos"}
                </p>

              </div>

              {/* =========================
                  GRID
              ========================== */}

              {productosFiltrados.length > 0 && (

                <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">

                  {productosFiltrados.map(
                    (product) => (

                      <article
                        key={product.id}
                        className="group"
                      >

                        {/* IMAGEN */}

                        <Link
                          to={`/producto/${product.id}`}
                          className="block overflow-hidden bg-gray-100"
                        >

                          <div className="aspect-square">

                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                            />

                          </div>

                        </Link>

                        {/* COLORES */}

                        <div className="mt-3 flex items-center gap-1.5">

                          {product.colors?.map(
                            (color) => (

                              <span
                                key={color}
                                title={color}
                                className={`h-2.5 w-2.5 rounded-full border border-gray-300 ${obtenerColorClase(
                                  color
                                )}`}
                              />

                            )
                          )}

                        </div>

                        {/* INFORMACIÓN */}

                        <div className="mt-2">

                          <p className="mb-1 text-[9px] uppercase tracking-wide text-gray-500">
                            {product.category}
                          </p>

                          <Link
                            to={`/producto/${product.id}`}
                          >

                            <h2 className="text-sm font-normal leading-tight hover:underline">
                              {product.name}
                            </h2>

                          </Link>

                          <p className="mt-2 text-sm font-medium">
                            $
                            {product.price.toLocaleString(
                              "es-AR"
                            )}
                          </p>

                          <p className="mt-1 text-[9px] text-gray-500">
                            2x $
                            {Math.round(
                              product.price / 2
                            ).toLocaleString(
                              "es-AR"
                            )}{" "}
                            sin interés
                          </p>

                          {/* COMPRAR */}

                          <Link
                            to={`/producto/${product.id}`}
                            className="mt-3 inline-flex rounded-btn bg-norte-mustard px-4 py-1.5 text-[10px] font-medium text-white transition hover:bg-mostaza-4"
                          >
                            Comprar
                          </Link>

                        </div>

                      </article>

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
                    No encontramos productos con
                    los filtros seleccionados.
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

        </section>

      </main>

    </>
  );
};

export default Catalogo;