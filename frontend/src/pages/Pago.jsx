import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useCart } from "../context/CartContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Pago = () => {
  const navigate = useNavigate();

  const {
    cart,
    clearCart,
  } = useCart();

  const [metodoPago, setMetodoPago] = useState("");
  const [procesando, setProcesando] = useState(false);

  // =========================
  // CALCULAR TOTAL REAL
  // =========================

  const totalPago = cart.reduce(
    (total, item) => {
      const precio = Number(item.price) || 0;
      const cantidad = Number(item.quantity) || 0;

      return total + precio * cantidad;
    },
    0
  );

  // =========================
  // PROCESAR PAGO
  // =========================

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!metodoPago || cart.length === 0) {
      return;
    }

    setProcesando(true);

    setTimeout(() => {
      // Guardamos solamente la compra actual
      const compra = {
        productos: [...cart],
        total: totalPago,
        metodoPago,
        fecha: new Date().toISOString(),
      };

      // Reemplaza cualquier compra anterior
      localStorage.setItem(
        "ultimaCompra",
        JSON.stringify(compra)
      );

      // Vaciar completamente el carrito
      clearCart();

      // También aseguramos que localStorage quede vacío
      localStorage.removeItem("cart");

      navigate("/confirmacion");
    }, 1500);
  };

  // =========================
  // CARRITO VACÍO
  // =========================

  if (cart.length === 0) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-[75vh] items-center justify-center bg-[var(--color-secondary)] px-4 py-12">

          <section className="w-full max-w-md rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-8 shadow-[var(--shadow-md)]">

            <div className="text-center">

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
                FINALIZAR COMPRA
              </p>

              <h1 className="text-3xl font-bold leading-tight">
                No hay productos
              </h1>

              <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                Tu carrito está vacío.
              </p>

              <Link
                to="/catalogo"
                className="mt-8 flex w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
              >
                Volver al catálogo
              </Link>

            </div>

          </section>

        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // PAGO
  // =========================

  return (
    <>
      <Navbar />

      <main className="flex min-h-[75vh] items-center justify-center bg-[var(--color-secondary)] px-4 py-12">

        <section className="w-full max-w-2xl rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-10">

          {/* ENCABEZADO */}

          <div className="mb-8 text-center">

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
              FINALIZAR COMPRA
            </p>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
              Realizar pago
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
              Seleccioná un método de pago para continuar.
            </p>

          </div>

          {/* =========================
              RESUMEN DEL PEDIDO
          ========================= */}

          <div className="mb-8 border-y border-[var(--color-border)]">

            <div className="divide-y divide-[var(--color-border)]">

              {cart.map((item) => {

                const precio =
                  Number(item.price) || 0;

                const cantidad =
                  Number(item.quantity) || 0;

                const subtotal =
                  precio * cantidad;

                return (
                  <article
                    key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                    className="flex items-start justify-between gap-4 py-4"
                  >

                    <div className="flex flex-col gap-1">

                      <h2 className="text-sm font-semibold">
                        {item.name}
                      </h2>

                      <span className="text-xs text-[var(--color-text-secondary)]">
                        Precio unitario: $
                        {precio.toLocaleString("es-AR")}
                      </span>

                      <span className="text-xs text-[var(--color-text-secondary)]">
                        Cantidad: {cantidad}
                      </span>

                      {item.selectedColor && (
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          Color: {item.selectedColor}
                        </span>
                      )}

                      {item.selectedSize && (
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          Talle: {item.selectedSize}
                        </span>
                      )}

                    </div>

                    <strong className="shrink-0 text-sm">
                      $
                      {subtotal.toLocaleString(
                        "es-AR"
                      )}
                    </strong>

                  </article>
                );
              })}

            </div>

            {/* =========================
                TOTAL
            ========================== */}

            <div className="flex items-center justify-between border-t border-[var(--color-border)] py-5">

              <span className="text-sm font-semibold">
                Total a pagar
              </span>

              <span className="text-xl font-bold">
                $
                {totalPago.toLocaleString(
                  "es-AR"
                )}
              </span>

            </div>

          </div>

          {/* =========================
              FORMULARIO
          ========================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>

              <label
                htmlFor="metodoPago"
                className="mb-2 block text-sm font-semibold"
              >
                Método de pago
              </label>

              <select
                id="metodoPago"
                value={metodoPago}
                onChange={(event) =>
                  setMetodoPago(event.target.value)
                }
                required
                className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-black/5"
              >

                <option value="">
                  Seleccionar método
                </option>

                <option value="tarjeta">
                  Tarjeta de crédito o débito
                </option>

                <option value="transferencia">
                  Transferencia bancaria
                </option>

              </select>

            </div>

            {/* BOTÓN */}

            <button
              type="submit"
              disabled={procesando}
              className="flex w-full items-center justify-center rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] hover:shadow-[var(--shadow-md)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {procesando
                ? "Procesando pago..."
                : `Pagar $${totalPago.toLocaleString("es-AR")}`}
            </button>

          </form>

          {/* VOLVER */}

          <Link
            to="/checkout"
            className="mt-5 block text-center text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
          >
            Volver al checkout
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Pago;