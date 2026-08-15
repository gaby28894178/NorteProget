import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Confirmacion = () => {
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const compraGuardada =
      localStorage.getItem("ultimaCompra");

    if (compraGuardada) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCompra(JSON.parse(compraGuardada));
      } catch (error) {
        console.error(
          "Error al leer la compra:",
          error
        );
      }
    }
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-12 sm:px-6 sm:py-16">

        <section className="w-full max-w-xl text-center">

          {/* =========================
              ICONO
          ========================== */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent)] text-3xl font-medium text-white">
            ✓
          </div>

          {/* =========================
              ENCABEZADO
          ========================== */}

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            COMPRA COMPLETADA
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            ¡Compra realizada!
          </h1>

          <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">
            Tu pago fue procesado correctamente.
          </p>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Gracias por comprar en NORTE.
          </p>

          {/* =========================
              RESUMEN DE COMPRA
          ========================== */}

          {compra && (
            <div className="mt-8 border-y border-[var(--color-border)] py-6 text-left">

              {/* ESTADO */}

              <div className="flex items-center justify-between gap-4">

                <span className="text-xs text-[var(--color-text-secondary)]">
                  Estado
                </span>

                <span className="text-xs font-semibold text-green-600">
                  Pago aprobado
                </span>

              </div>

              {/* MÉTODO DE PAGO */}

              <div className="mt-4 flex items-center justify-between gap-4">

                <span className="text-xs text-[var(--color-text-secondary)]">
                  Método de pago
                </span>

                <span className="text-right text-xs font-semibold">
                  {compra.metodoPago === "tarjeta"
                    ? "Tarjeta de crédito o débito"
                    : "Transferencia bancaria"}
                </span>

              </div>

              {/* PRODUCTOS */}

              {compra.productos?.length > 0 && (
                <div className="mt-6 border-t border-[var(--color-border)] pt-5">

                  <h2 className="mb-4 text-sm font-bold">
                    Productos
                  </h2>

                  <div className="divide-y divide-[var(--color-border)]">

                    {compra.productos.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                        className="flex items-start justify-between gap-4 py-3"
                      >

                        <div>

                          <p className="text-sm font-medium">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                            Cantidad: {item.quantity}
                          </p>

                          {item.selectedColor && (
                            <p className="text-xs text-[var(--color-text-secondary)]">
                              Color: {item.selectedColor}
                            </p>
                          )}

                          {item.selectedSize && (
                            <p className="text-xs text-[var(--color-text-secondary)]">
                              Talle: {item.selectedSize}
                            </p>
                          )}

                        </div>

                        <span className="shrink-0 text-sm font-semibold">
                          $
                          {(
                            item.price * item.quantity
                          ).toLocaleString("es-AR")}
                        </span>

                      </div>
                    ))}

                  </div>

                </div>
              )}

              {/* TOTAL */}

              <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-5">

                <span className="text-sm font-semibold">
                  Total pagado
                </span>

                <span className="text-xl font-bold">
                  $
                  {compra.total?.toLocaleString(
                    "es-AR"
                  )}
                </span>

              </div>

            </div>
          )}

          {/* =========================
              BOTÓN INICIO
          ========================== */}

          <Link
            to="/"
            className="mt-8 inline-flex rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-7 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
          >
            Volver al inicio
          </Link>

          {/* =========================
              SEGUIR COMPRANDO
          ========================== */}

          <Link
            to="/catalogo"
            className="mt-4 block text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
          >
            Seguir comprando
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Confirmacion;