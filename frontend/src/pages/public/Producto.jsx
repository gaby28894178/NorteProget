import { useEffect, useState, useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { getProductById } from "../../api/productApi";
import { getActiveCategories } from "../../api/categoryApi";
import { useCart } from "../../context/CartContext";
import { trackViewItem } from "../../utils/analytics";

const Producto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { addToCart } = useCart();

  // =========================
  // CARGAR PRODUCTO
  // =========================

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const [productData, categoryData] = await Promise.all([
          getProductById(id),
          getActiveCategories(),
        ]);
        if (isMounted) {
          if (!productData || productData.status !== "PUBLISHED") {
            setNotFound(true);
          } else {
            setProduct(productData);
          }
          setCategories(categoryData);
        }
      } catch (err) {
        console.error("Error al cargar producto:", err);
        if (isMounted) setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // =========================
  // PRODUCTO ENRIQUECIDO
  // =========================

  const enrichedProduct = useMemo(() => {
    if (!product) return null;

    const category = categories.find((c) => c.id === product.category_id);

    const colors = [
      ...new Set((product.variants || []).map((v) => v.color).filter(Boolean)),
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
      allImages: sortedImages,
    };
  }, [product, categories]);

  const [colorSeleccionado, setColorSeleccionado] = useState("");

  const [talleSeleccionado, setTalleSeleccionado] = useState("");

  const [cantidad, setCantidad] = useState(1);

  // Inicializar selecciones cuando el producto se carga
  // Se resuelve en el render: si enrichedProduct cambió, se toman sus valores
  const initialColors = enrichedProduct?.colors || [];
  const initialSizes = enrichedProduct?.sizes || [];
  const activeColor = colorSeleccionado || initialColors[0] || "";
  const activeSize = talleSeleccionado || initialSizes[0] || "";

  // =========================
  // ANALYTICS — VISTA DE PRODUCTO
  // =========================

  useEffect(() => {
    if (enrichedProduct) {
      trackViewItem({ product: enrichedProduct });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // =========================
  // CANTIDAD
  // =========================

  const aumentarCantidad = () => {
    setCantidad((cantidadActual) => cantidadActual + 1);
  };

  const disminuirCantidad = () => {
    setCantidad((cantidadActual) => Math.max(1, cantidadActual - 1));
  };

  // =========================
  // AGREGAR AL CARRITO
  // =========================

  const manejarAgregarAlCarrito = () => {
    addToCart({
      ...enrichedProduct,
      selectedColor: activeColor,
      selectedSize: activeSize,
      quantity: cantidad,
    });
  };

  // =========================
  // COMPRAR AHORA
  // =========================

  const manejarComprarAhora = () => {
    addToCart({
      ...enrichedProduct,
      selectedColor: activeColor,
      selectedSize: activeSize,
      quantity: cantidad,
    });

    navigate("/carrito");
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-white px-6 py-12 lg:px-10 lg:py-16">
        <section className="mx-auto max-w-7xl text-center py-20">
          <p className="text-sm text-gray-500">Cargando producto...</p>
        </section>
      </main>
    );
  }

  // =========================
  // PRODUCTO NO ENCONTRADO
  // =========================

  if (notFound || !enrichedProduct) {
    return (
      <>
        <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">
          <section className="text-center">
            <h1 className="text-[28px] font-bold">Producto no encontrado</h1>

            <Link
              to="/catalogo"
              className="mt-6 inline-flex rounded-btn bg-norte-mustard px-6 py-3 text-sm font-medium text-white transition hover:bg-mostaza-4"
            >
              Volver al catálogo
            </Link>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="min-h-[70vh] bg-white px-6 py-12 lg:px-10 lg:py-16">
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* =========================
              IMAGEN
          ========================== */}

          <div className="overflow-hidden bg-gray-100">
            <div className="aspect-square">
              <img
                src={enrichedProduct.imageUrl}
                alt={enrichedProduct.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* =========================
              INFORMACIÓN
          ========================== */}

          <div className="flex flex-col justify-center">
            {/* CATEGORÍA */}

            <span className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-norte-mustard">
              {enrichedProduct.categoryName}
            </span>

            {/* NOMBRE */}

            <h1 className="text-[28px] font-bold leading-tight tracking-tight sm:text-[36px] lg:text-[48px]">
              {enrichedProduct.name}
            </h1>

            {/* DESCRIPCIÓN */}

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-500">
              {enrichedProduct.description}
            </p>

            {/* PRECIO */}

            <div className="mt-7">
              <p className="text-3xl font-semibold">
                ${Number(enrichedProduct.current_price).toLocaleString("es-AR")}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                2x $
                {Math.round(
                  Number(enrichedProduct.current_price) / 2,
                ).toLocaleString("es-AR")}{" "}
                sin interés
              </p>
            </div>

            {/* =========================
                COLOR
            ========================== */}

            {enrichedProduct.colors?.length > 0 && (
              <div className="mt-8">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                  Color
                </h2>

                <div className="flex flex-wrap gap-2">
                  {enrichedProduct.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setColorSeleccionado(color)}
                      className={`rounded-md border px-4 py-2 text-xs transition ${
                        activeColor === color
                          ? "border-norte-mustard bg-norte-mustard text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-norte-mustard hover:text-norte-mustard"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* =========================
                TALLE
            ========================== */}

            {enrichedProduct.sizes?.length > 0 && (
              <div className="mt-7">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                  Talle
                </h2>

                <div className="flex flex-wrap gap-2">
                  {enrichedProduct.sizes.map((talle) => (
                    <button
                      key={talle}
                      type="button"
                      onClick={() => setTalleSeleccionado(talle)}
                      className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-xs transition ${
                        activeSize === talle
                          ? "border-norte-mustard bg-norte-mustard text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-norte-mustard hover:text-norte-mustard"
                      }`}
                    >
                      {talle}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* =========================
                CANTIDAD
            ========================== */}

            <div className="mt-7">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                Cantidad
              </h2>

              <div className="inline-flex items-center overflow-hidden rounded-md border border-gray-300">
                <button
                  type="button"
                  onClick={disminuirCantidad}
                  aria-label="Disminuir cantidad"
                  className="flex h-10 w-10 items-center justify-center text-lg transition hover:bg-gray-100"
                >
                  −
                </button>

                <span className="flex h-10 min-w-10 items-center justify-center border-x border-gray-300 text-sm">
                  {cantidad}
                </span>

                <button
                  type="button"
                  onClick={aumentarCantidad}
                  aria-label="Aumentar cantidad"
                  className="flex h-10 w-10 items-center justify-center text-lg transition hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* =========================
                ACCIONES
            ========================== */}

            <div className="mt-8 flex flex-col gap-3">
              {/* AGREGAR */}

              <button
                type="button"
                onClick={manejarAgregarAlCarrito}
                className="flex w-full items-center justify-center rounded-sm bg-norte-mustard px-6 py-3 text-sm font-medium text-white transition hover:bg-mostaza-4"
              >
                Agregar al carrito
              </button>

              {/* COMPRAR */}

              <button
                type="button"
                onClick={manejarComprarAhora}
                className="flex w-full items-center justify-center rounded-btn border border-norte-mustard bg-white px-6 py-3 text-sm font-medium text-norte-mustard transition hover:bg-norte-mustard hover:text-white"
              >
                Comprar ahora
              </button>

              {/* VOLVER */}

              <Link
                to="/catalogo"
                className="flex w-full items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-sm text-gray-600 transition hover:border-norte-mustard hover:text-norte-mustard"
              >
                Volver al catálogo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Producto;
