import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";


const Checkout = () => {
  const { isAuthenticated } = useAuth();
  const { cart, totalPrice } = useCart();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
  });

  // =========================
  // MANEJAR FORMULARIO
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // =========================
  // ENVIAR CHECKOUT
  // =========================

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Datos de compra:", formData);
    console.log("Productos:", cart);
    console.log("Total:", totalPrice);

    navigate("/pago");
  };

  // =========================
  // CARRITO VACÍO
  // =========================

  if (cart.length === 0) {
    return (
      <>

        <main className="min-h-[70vh] bg-white px-6 py-20">
          <section className="mx-auto flex max-w-xl flex-col items-center justify-center text-center">

            <h1 className="mb-4 text-3xl font-bold">
              Tu carrito está vacío
            </h1>

            <p className="mb-8 text-sm text-gray-500">
              Agregá productos antes de continuar
              con la compra.
            </p>

            <Link
              to="/catalogo"
              className="rounded-btn bg-norte-mustard px-6 py-3 text-sm font-semibold text-white transition hover:bg-mostaza-4"
            >
              Volver al catálogo
            </Link>

          </section>
        </main>

      </>
    );
  }

  // =========================
  // USUARIO NO AUTENTICADO
  // =========================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: "/checkout",
        }}
        replace
      />
    );
  }

  return (
    <>

      <main className="min-h-screen bg-[#f8f7f5] px-6 py-12 lg:px-10">

        <section className="mx-auto max-w-6xl">

          {/* =========================
              ENCABEZADO
          ========================== */}

          <div className="mb-10">

            <p className="mb-2 text-xs font-bold tracking-[0.18em] text-norte-mustard">
              FINALIZAR COMPRA
            </p>

            <h1 className="mb-2 text-3xl font-bold md:text-4xl">
              Datos de compra
            </h1>

            <p className="text-sm text-gray-500">
              Completá tus datos para continuar.
            </p>

          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

            {/* =========================
                RESUMEN DEL CARRITO
            ========================== */}

            <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6">

              <h2 className="mb-6 text-lg font-semibold">
                Resumen del pedido
              </h2>

              <div className="space-y-5">

                {cart.map((item) => (

                  <article
                    key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                    className="flex gap-4 border-b border-gray-100 pb-5"
                  >

                    {/* IMAGEN */}

                    <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-100">

                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />

                    </div>

                    {/* INFORMACIÓN */}

                    <div className="flex-1">

                      <p className="mb-1 text-[10px] uppercase tracking-wide text-gray-400">
                        {item.category}
                      </p>

                      <h3 className="mb-2 text-sm font-semibold">
                        {item.name}
                      </h3>

                      {item.selectedColor && (
                        <p className="text-xs text-gray-500">
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

                      <p className="text-xs text-gray-500">
                        Cantidad:{" "}
                        <span className="font-medium text-gray-700">
                          {item.quantity}
                        </span>
                      </p>

                      <p className="mt-2 text-sm font-semibold">
                        $
                        {(
                          item.price * item.quantity
                        ).toLocaleString("es-AR")}
                      </p>

                    </div>

                  </article>

                ))}

              </div>

              {/* TOTAL */}

              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">

                <span className="text-sm font-medium">
                  Total
                </span>

                <strong className="text-xl">
                  $
                  {totalPrice.toLocaleString(
                    "es-AR"
                  )}
                </strong>

              </div>

            </aside>

            {/* =========================
                FORMULARIO
            ========================== */}

            <section className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">

              <h2 className="mb-6 text-lg font-semibold">
                Información del comprador
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >

                {/* NOMBRE */}

                <div>
                  <label
                    htmlFor="nombre"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Nombre
                  </label>

                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-norte-mustard focus:ring-1 focus:ring-norte-mustard"
                  />
                </div>

                {/* APELLIDO */}

                <div>
                  <label
                    htmlFor="apellido"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Apellido
                  </label>

                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-norte-mustard focus:ring-1 focus:ring-norte-mustard"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-norte-mustard focus:ring-1 focus:ring-norte-mustard"
                  />
                </div>

                {/* TELÉFONO */}

                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Teléfono
                  </label>

                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-norte-mustard focus:ring-1 focus:ring-norte-mustard"
                  />
                </div>

                {/* DIRECCIÓN */}

                <div className="md:col-span-2">
                  <label
                    htmlFor="direccion"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Dirección
                  </label>

                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-norte-mustard focus:ring-1 focus:ring-norte-mustard"
                  />
                </div>

                {/* CIUDAD */}

                <div>
                  <label
                    htmlFor="ciudad"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Ciudad
                  </label>

                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-norte-mustard focus:ring-1 focus:ring-norte-mustard"
                  />
                </div>

                {/* CÓDIGO POSTAL */}

                <div>
                  <label
                    htmlFor="codigoPostal"
                    className="mb-2 block text-xs font-semibold"
                  >
                    Código postal
                  </label>

                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-norte-mustard focus:ring-1 focus:ring-norte-mustard"
                  />
                </div>

                {/* BOTÓN */}

                <div className="mt-3 md:col-span-2">

                  <button
                    type="submit"
                    className="w-full rounded-btn bg-norte-mustard px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-mostaza-4 hover:-translate-y-0.5"
                  >
                    Continuar con la compra
                  </button>

                </div>

              </form>

              <Link
                to="/carrito"
                className="mt-5 block text-center text-sm text-gray-500 transition hover:text-norte-mustard"
              >
                ← Volver al carrito
              </Link>

            </section>

          </div>

        </section>

      </main>

    </>
  );
};

export default Checkout;