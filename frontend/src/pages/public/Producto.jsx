import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LuChevronLeft, LuChevronRight, LuMinus, LuPlus } from "react-icons/lu";

import { getProductById } from "../../api/productApi";
import { getActiveCategories } from "../../api/categoryApi";
import { useCart } from "../../context/CartContext";
import { trackViewItem } from "../../utils/analytics";

// Mapeo visual nombre de color -> hex (reutilizado del admin)
const COLOR_HEX = {
  negro: "#1c1b19",
  blanco: "#ffffff",
  gris: "#9ca3af",
  "gris oxford": "#7d8184",
  "azul marino": "#1f2d52",
  "verde militar": "#4b5d3c",
  beige: "#d9c7a7",
  rojo: "#b91c1c",
  azul: "#1d4ed8",
};

const LIGHT_COLORS = ["blanco", "beige"];

const colorToHex = (colorName) => {
  if (!colorName) return "#d1d5db";
  return COLOR_HEX[colorName.trim().toLowerCase()] ?? "#d1d5db";
};

const isLightColor = (colorName) =>
  LIGHT_COLORS.includes(colorName?.trim().toLowerCase());

const Producto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imagenActiva, setImagenActiva] = useState(0);

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
            setImagenActiva(0);
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

  const [touchStart, setTouchStart] = useState(null);

  const [touchEnd, setTouchEnd] = useState(null);

  // Inicializar selecciones cuando el producto se carga
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

  const totalImages = enrichedProduct?.allImages?.length || 0;

  const imagenAnterior = () => {
    setImagenActiva((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const imagenSiguiente = () => {
    setImagenActiva((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipe = 50;
    if (distance > minSwipe) {
      imagenSiguiente();
    } else if (distance < -minSwipe) {
      imagenAnterior();
    }
  };

  const aumentarCantidad = () => {
    setCantidad((prev) => prev + 1);
  };

  const disminuirCantidad = () => {
    setCantidad((prev) => Math.max(1, prev - 1));
  };

  const manejarCambioCantidad = (e) => {
    const valor = e.target.value;
    if (valor === "") {
      setCantidad(1);
      return;
    }
    const parsed = parseInt(valor, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      setCantidad(parsed);
    }
  };

  const manejarBlurCantidad = (e) => {
    const valor = parseInt(e.target.value, 10);
    if (isNaN(valor) || valor < 1) {
      setCantidad(1);
    }
  };

  // =========================
  // AGREGAR AL CARRITO
  // =========================

  const manejarAgregarAlCarrito = useCallback(() => {
    addToCart({
      ...enrichedProduct,
      selectedColor: activeColor,
      selectedSize: activeSize,
      quantity: cantidad,
    });
    toast.success("Item agregado al carrito");
  }, [enrichedProduct, activeColor, activeSize, cantidad, addToCart]);

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

          <div className="flex flex-col-reverse gap-4 lg:flex-row">
            {/* Miniaturas — solo desktop (lg+) */}
            {totalImages > 1 && (
              <div className="hidden lg:flex flex-col gap-2">
                {enrichedProduct.allImages.map((image, index) => (
                  <button
                    key={image.id ?? index}
                    type="button"
                    onClick={() => setImagenActiva(index)}
                    className={`h-18 w-18 shrink-0 overflow-hidden rounded-md border transition ${
                      imagenActiva === index
                        ? "border-norte-dark"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image.secure_url}
                      alt={`${enrichedProduct.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Imagen principal — desktop estática, mobile carrusel */}
            <div
              className="relative aspect-square w-full overflow-hidden bg-gray-100"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={
                  enrichedProduct.allImages[imagenActiva]?.secure_url ||
                  enrichedProduct.imageUrl
                }
                alt={enrichedProduct.name}
                className="h-full w-full object-cover"
              />

              {/* Controles del carrusel — solo mobile/tablet */}
              {totalImages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={imagenAnterior}
                    aria-label="Imagen anterior"
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sm font-bold text-gray-700 shadow transition hover:bg-white lg:hidden"
                  >
                    <LuChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={imagenSiguiente}
                    aria-label="Imagen siguiente"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-sm font-bold text-gray-700 shadow transition hover:bg-white lg:hidden"
                  >
                    <LuChevronRight size={18} />
                  </button>

                  {/* Indicadores — solo mobile */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 lg:hidden">
                    {enrichedProduct.allImages.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setImagenActiva(index)}
                        aria-label={`Ver imagen ${index + 1}`}
                        className={`h-2 rounded-full transition ${
                          imagenActiva === index
                            ? "w-5 bg-norte-mustard"
                            : "w-2 bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* =========================
              INFORMACIÓN
          ========================== */}

          <div className="flex flex-col justify-start">
            {/* CATEGORÍA */}

            <span className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-norte-mustard">
              {enrichedProduct.categoryName}
            </span>

            {/* NOMBRE */}

            <h1 className="text-[28px] font-normal leading-tight tracking-tight sm:text-[32px]">
              {enrichedProduct.name}
            </h1>

            {/* DESCRIPCIÓN */}

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-500">
              {enrichedProduct.description}
            </p>

            {/* PRECIO */}

            <div className="mt-7">
              <p className="text-[32px] font-normal sm:text-[40px]">
                ${Number(enrichedProduct.current_price).toLocaleString("es-AR")}
              </p>

              <p className="mt-1 text-base text-gray-500">
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
                <h2 className="mb-3 text-base font-normal tracking-wide">
                  Color:{" "}
                  <span className="uppercase font-semibold text-gray-600">
                    {activeColor}
                  </span>
                </h2>

                <div className="flex flex-wrap gap-2">
                  {enrichedProduct.colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setColorSeleccionado(color)}
                      aria-label={`Color ${color}`}
                      title={color}
                      className={`flex h-8.5 w-8.5 items-center justify-center rounded-md border transition-all ${
                        activeColor === color
                          ? "border-norte-dark bg-[#E2E2E2]"
                          : isLightColor(color)
                            ? "border-gray-400 hover:border-norte-mustard"
                            : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <span
                        className="h-3.75 w-3.75 border-2 border-gray-300"
                        style={{ backgroundColor: colorToHex(color) }}
                      />
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
                <h2 className="mb-3 text-base font-normal tracking-wide">
                  Talle:{" "}
                  <span className="font-semibold uppercase text-gray-600">
                    {activeSize}
                  </span>
                </h2>

                <div className="flex flex-wrap gap-2">
                  {enrichedProduct.sizes.map((talle) => (
                    <button
                      key={talle}
                      type="button"
                      onClick={() => setTalleSeleccionado(talle)}
                      className={`flex h-8.5 min-w-8.5 items-center justify-center rounded-md border px-3 text-xs transition ${
                        activeSize === talle
                          ? "border-norte-dark bg-[#E2E2E2] text-norte-dark"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {talle}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* =========================
                CANTIDAD + AGREGAR
            ========================== */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex w-fit items-center overflow-hidden rounded-md border border-gray-300">
                <button
                  type="button"
                  onClick={disminuirCantidad}
                  aria-label="Disminuir cantidad"
                  className="flex h-12.75 w-8.5 items-center justify-center transition hover:bg-gray-100"
                >
                  <LuMinus size={16} />
                </button>

                <input
                  id="cantidad"
                  type="number"
                  name="cantidad"
                  min="1"
                  value={cantidad}
                  onChange={manejarCambioCantidad}
                  onBlur={manejarBlurCantidad}
                  aria-label="Cantidad"
                  className="h-12.75 w-14 border-x border-gray-300 text-center text-sm font-medium outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />

                <button
                  type="button"
                  onClick={aumentarCantidad}
                  aria-label="Aumentar cantidad"
                  className="flex h-12.75 w-8.5 items-center justify-center transition hover:bg-gray-100"
                >
                  <LuPlus size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={manejarAgregarAlCarrito}
                className="flex h-12.75 w-full items-center justify-center rounded-sm bg-norte-mustard px-6 text-sm font-medium text-white transition hover:bg-mostaza-4 sm:w-69.75"
              >
                Agregar al carrito
              </button>
            </div>

            {/* =========================
                ACCIONES
            ========================== */}

            <div className="mt-3 flex flex-col gap-3">
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
