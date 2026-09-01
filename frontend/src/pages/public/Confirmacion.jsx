import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { LuCheck } from "react-icons/lu";
import { trackPurchase } from "../../utils/analytics";

// TODO(limpiar): Reemplazar lectura de localStorage por una llamada a la API
// para obtener el pedido creado en el backend (cuando exista POST /orders).
const Confirmacion = () => {
  // Inicialización diferida del estado desde localStorage
  const [compra] = useState(() => {
    const compraGuardada = localStorage.getItem("ultimaCompra");
    if (!compraGuardada) return null;
    try {
      return JSON.parse(compraGuardada);
    } catch (error) {
      console.error("Error al leer la compra:", error);
      return null;
    }
  });

  const trackedRef = useRef(false);

  // El efecto solo se encarga de sincronizar con el sistema externo (GA4)
  useEffect(() => {
    if (compra && !trackedRef.current) {
      trackPurchase({
        transaction_id: compra.id || `ORDER-${Date.now()}`,
        value: Number(compra.total || 0),
        currency: "ARS",
        items: compra.productos || [],
      });
      trackedRef.current = true;
    }
  }, [compra]);

  return (
    <>
      <main className="flex min-h-[70vh] items-center justify-center bg-white px-4 py-12 sm:px-6 sm:py-16">
        <section className="w-full max-w-xl text-center">
          {/* =========================
              ICONO
          ========================== */}

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-norte-mustard text-white">
            <LuCheck size={32} />
          </div>

          {/* =========================
              ENCABEZADO
          ========================== */}

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-norte-mustard">
            COMPRA COMPLETADA
          </p>

          <h1 className="mt-3 text-[28px] font-bold leading-tight sm:text-[36px] lg:text-[48px]">
            ¡Compra realizada!
          </h1>

          <p className="mt-4 text-sm leading-6 text-gray-600">
            Tu pago fue procesado correctamente.
          </p>

          <p className="mt-2 text-sm text-gray-600">
            Gracias por comprar en NORTE.
          </p>

          {/* =========================
              RESUMEN DE COMPRA
          ========================== */}

          {compra && (
            <div className="mt-8 border-y border-norte-stone py-6 text-left">
              {/* ESTADO */}

              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-gray-600">Estado</span>

                <span className="text-xs font-semibold text-green-600">
                  Pago aprobado
                </span>
              </div>

              {/* MÉTODO DE PAGO */}

              <div className="mt-4 flex items-center justify-between gap-4">
                <span className="text-xs text-gray-600">Método de pago</span>

                <span className="text-right text-xs font-semibold">
                  {compra.metodoPago === "tarjeta"
                    ? "Tarjeta de crédito o débito"
                    : "Transferencia bancaria"}
                </span>
              </div>

              {/* PRODUCTOS */}

              {compra.productos?.length > 0 && (
                <div className="mt-6 border-t border-norte-stone pt-5">
                  <h2 className="mb-4 text-sm font-bold">Productos</h2>

                  <div className="divide-y divide-norte-stone">
                    {compra.productos.map((item) => (
                      <div
                        key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                        className="flex items-start justify-between gap-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>

                          <p className="mt-1 text-xs text-gray-600">
                            Cantidad: {item.quantity}
                          </p>

                          {item.selectedColor && (
                            <p className="text-xs text-gray-600">
                              Color: {item.selectedColor}
                            </p>
                          )}

                          {item.selectedSize && (
                            <p className="text-xs text-gray-600">
                              Talle: {item.selectedSize}
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 text-sm font-semibold">
                          $
                          {(item.price * item.quantity).toLocaleString("es-AR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TOTAL */}

              <div className="mt-5 flex items-center justify-between border-t border-norte-stone pt-5">
                <span className="text-sm font-semibold">Total pagado</span>

                <span className="text-xl font-bold">
                  ${compra.total?.toLocaleString("es-AR")}
                </span>
              </div>
            </div>
          )}

          {/* =========================
              BOTÓN INICIO
          ========================== */}

          <Link
            to="/"
            className="mt-8 inline-flex rounded-btn bg-norte-mustard px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-mostaza-4"
          >
            Volver al inicio
          </Link>

          {/* =========================
              SEGUIR COMPRANDO
          ========================== */}

          <Link
            to="/catalogo"
            className="mt-4 block text-sm text-gray-600 transition hover:text-norte-mustard"
          >
            Seguir comprando
          </Link>
        </section>
      </main>
    </>
  );
};

export default Confirmacion;
