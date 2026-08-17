import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";


const Carrito = () => {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <>

      <main className="min-h-screen bg-[#f8f7f5] px-6 py-12 lg:px-10">
        <section className="mx-auto max-w-6xl">

          {/* =========================
              TÍTULO
          ========================== */}

          <div className="mb-10">
            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-norte-mustard">
              NORTE
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Mi carrito
            </h1>
          </div>

          {/* =========================
              CARRITO VACÍO
          ========================== */}

          {cart.length === 0 ? (
            <section className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">

              <div className="mb-5 text-5xl">
                🛒
              </div>

              <h2 className="mb-3 text-2xl font-semibold">
                Tu carrito está vacío
              </h2>

              <p className="mb-8 text-sm text-gray-500">
                Todavía no agregaste ningún producto.
              </p>

              <Link
                to="/catalogo"
                className="inline-flex rounded-btn bg-norte-mustard px-6 py-3 text-sm font-semibold text-white transition hover:bg-mostaza-4"
              >
                Ver catálogo
              </Link>

            </section>
          ) : (

            /* =========================
               CARRITO CON PRODUCTOS
            ========================== */

            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

              {/* =========================
                  PRODUCTOS
              ========================== */}

              <section className="rounded-xl border border-gray-200 bg-white p-6">

                <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-5">

                  <h2 className="text-lg font-semibold">
                    Productos
                  </h2>

                  <span className="text-sm text-gray-500">
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "producto"
                      : "productos"}
                  </span>

                </div>

                <div className="space-y-6">

                  {cart.map((item) => {

                    // Calculamos el subtotal
                    // directamente con el estado actual
                    const subtotal =
                      Number(item.price || 0) *
                      Number(item.quantity || 0);

                    return (
                      <article
                        key={`${item.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
                        className="flex flex-col gap-5 border-b border-gray-100 pb-6 sm:flex-row"
                      >

                        {/* IMAGEN */}

                        <Link
                          to={`/producto/${item.id}`}
                          className="h-32 w-full shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-32 sm:w-32"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          />
                        </Link>

                        {/* INFORMACIÓN */}

                        <div className="flex flex-1 flex-col">

                          <div className="flex flex-col justify-between gap-3 sm:flex-row">

                            <div>

                              <p className="mb-1 text-[10px] uppercase tracking-wide text-gray-400">
                                {item.category}
                              </p>

                              <h3 className="text-base font-semibold">
                                {item.name}
                              </h3>

                              {item.selectedColor && (
                                <p className="mt-2 text-xs text-gray-500">
                                  Color:{" "}
                                  <span className="font-medium text-gray-700">
                                    {item.selectedColor}
                                  </span>
                                </p>
                              )}

                              {item.selectedSize && (
                                <p className="text-xs text-gray-500">
                                  Talle:{" "}
                                  <span className="font-medium text-gray-700">
                                    {item.selectedSize}
                                  </span>
                                </p>
                              )}

                            </div>

                            {/* SUBTOTAL DEL PRODUCTO */}

                            <p className="font-semibold">
                              $
                              {subtotal.toLocaleString(
                                "es-AR"
                              )}
                            </p>

                          </div>

                          {/* =========================
                              ACCIONES
                          ========================== */}

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                            {/* CANTIDAD */}

                            <div className="flex items-center overflow-hidden rounded-md border border-gray-300">

                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(
                                    item.id,
                                    item.selectedColor,
                                    item.selectedSize
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center text-lg transition hover:bg-gray-100"
                                aria-label="Disminuir cantidad"
                              >
                                −
                              </button>

                              <span className="flex h-9 min-w-10 items-center justify-center border-x border-gray-300 text-sm">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseQuantity(
                                    item.id,
                                    item.selectedColor,
                                    item.selectedSize
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center text-lg transition hover:bg-gray-100"
                                aria-label="Aumentar cantidad"
                              >
                                +
                              </button>

                            </div>

                            {/* ELIMINAR */}

                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(
                                  item.id,
                                  item.selectedColor,
                                  item.selectedSize
                                )
                              }
                              className="text-xs text-gray-500 transition hover:text-red-600"
                            >
                              Eliminar
                            </button>

                          </div>

                        </div>

                      </article>
                    );
                  })}

                </div>

                {/* SEGUIR COMPRANDO */}

                <Link
                  to="/catalogo"
                  className="mt-6 inline-block text-sm text-gray-500 transition hover:text-norte-mustard"
                >
                  ← Seguir comprando
                </Link>

              </section>

              {/* =========================
                  RESUMEN
              ========================== */}

              <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6">

                <h2 className="mb-6 text-lg font-semibold">
                  Resumen
                </h2>

                <div className="space-y-4 border-b border-gray-200 pb-5">

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Productos
                    </span>

                    <span>
                      {totalItems}
                    </span>

                  </div>

                  <div className="flex justify-between text-sm">

                    <span className="text-gray-500">
                      Envío
                    </span>

                    <span className="font-medium">
                      Gratis
                    </span>

                  </div>

                </div>

                {/* TOTAL */}

                <div className="flex items-center justify-between py-5">

                  <span className="font-medium">
                    Total
                  </span>

                  <strong className="text-xl">
                    $
                    {totalPrice.toLocaleString(
                      "es-AR"
                    )}
                  </strong>

                </div>

                <Link
                  to="/checkout"
                  className="flex w-full items-center justify-center rounded-btn bg-norte-mustard px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-mostaza-4"
                >
                  Continuar con la compra
                </Link>

              </aside>

            </div>
          )}

        </section>
      </main>

    </>
  );
};

export default Carrito;