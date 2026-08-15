import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import products from "../data/products";
import { useCart } from "../context/CartContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Producto = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find(
    (product) => product.id === Number(id)
  );

  const { addToCart } = useCart();

  const [colorSeleccionado, setColorSeleccionado] =
    useState(product?.colors?.[0] || "");

  const [talleSeleccionado, setTalleSeleccionado] =
    useState(product?.sizes?.[0] || "");

  const [cantidad, setCantidad] = useState(1);

  // =========================
  // PRODUCTO NO ENCONTRADO
  // =========================

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[70vh] items-center justify-center px-6 py-16">

          <section className="text-center">

            <h1 className="text-2xl font-normal">
              Producto no encontrado
            </h1>

            <Link
              to="/catalogo"
              className="mt-6 inline-flex rounded-md bg-[#a86620] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8e571b]"
            >
              Volver al catálogo
            </Link>

          </section>

        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // CANTIDAD
  // =========================

  const aumentarCantidad = () => {
    setCantidad((cantidadActual) => cantidadActual + 1);
  };

  const disminuirCantidad = () => {
    setCantidad((cantidadActual) =>
      Math.max(1, cantidadActual - 1)
    );
  };

  // =========================
  // AGREGAR AL CARRITO
  // =========================

  const manejarAgregarAlCarrito = () => {
    addToCart({
      ...product,
      selectedColor: colorSeleccionado,
      selectedSize: talleSeleccionado,
      quantity: cantidad,
    });
  };

  // =========================
  // COMPRAR AHORA
  // =========================

  const manejarComprarAhora = () => {
    addToCart({
      ...product,
      selectedColor: colorSeleccionado,
      selectedSize: talleSeleccionado,
      quantity: cantidad,
    });

    navigate("/carrito");
  };

  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] bg-white px-6 py-12 lg:px-10 lg:py-16">

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">

          {/* =========================
              IMAGEN
          ========================== */}

          <div className="overflow-hidden bg-gray-100">

            <div className="aspect-square">

              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />

            </div>

          </div>

          {/* =========================
              INFORMACIÓN
          ========================== */}

          <div className="flex flex-col justify-center">

            {/* CATEGORÍA */}

            <span className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a86620]">
              {product.category}
            </span>

            {/* NOMBRE */}

            <h1 className="text-3xl font-normal leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            {/* DESCRIPCIÓN */}

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500">
              {product.description}
            </p>

            {/* PRECIO */}

            <div className="mt-7">

              <p className="text-2xl font-semibold">
                $
                {product.price.toLocaleString(
                  "es-AR"
                )}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                2x $
                {Math.round(
                  product.price / 2
                ).toLocaleString("es-AR")}{" "}
                sin interés
              </p>

            </div>

            {/* =========================
                COLOR
            ========================== */}

            {product.colors?.length > 0 && (
              <div className="mt-8">

                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide">
                  Color
                </h2>

                <div className="flex flex-wrap gap-2">

                  {product.colors.map((color) => (

                    <button
                      key={color}
                      type="button"
                      onClick={() =>
                        setColorSeleccionado(color)
                      }
                      className={`rounded-md border px-4 py-2 text-xs transition ${
                        colorSeleccionado === color
                          ? "border-[#a86620] bg-[#a86620] text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-[#a86620] hover:text-[#a86620]"
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

            {product.sizes?.length > 0 && (
              <div className="mt-7">

                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide">
                  Talle
                </h2>

                <div className="flex flex-wrap gap-2">

                  {product.sizes.map((talle) => (

                    <button
                      key={talle}
                      type="button"
                      onClick={() =>
                        setTalleSeleccionado(talle)
                      }
                      className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-xs transition ${
                        talleSeleccionado === talle
                          ? "border-[#a86620] bg-[#a86620] text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-[#a86620] hover:text-[#a86620]"
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

              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide">
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
                className="flex w-full items-center justify-center rounded-md bg-[#a86620] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8e571b]"
              >
                Agregar al carrito
              </button>

              {/* COMPRAR */}

              <button
                type="button"
                onClick={manejarComprarAhora}
                className="flex w-full items-center justify-center rounded-md border border-[#a86620] bg-white px-6 py-3 text-sm font-medium text-[#a86620] transition hover:bg-[#a86620] hover:text-white"
              >
                Comprar ahora
              </button>

              {/* VOLVER */}

              <Link
                to="/catalogo"
                className="flex w-full items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-sm text-gray-600 transition hover:border-[#a86620] hover:text-[#a86620]"
              >
                Volver al catálogo
              </Link>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Producto;