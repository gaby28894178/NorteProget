import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PreguntasFrecuentes = () => {
  return (
    <>
      <Navbar />

      <main className="min-h-[70vh] bg-white px-6 py-16">

        <section className="mx-auto max-w-3xl">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a86620]">
            NORTE
          </p>

          <h1 className="text-3xl font-normal">
            Preguntas frecuentes
          </h1>

          <div className="mt-10 space-y-8">

            <div>
              <h2 className="mb-2 text-base font-semibold">
                ¿Cómo puedo comprar?
              </h2>

              <p className="text-sm leading-7 text-gray-600">
                Elegí el producto que quieras, seleccioná
                color y talle, agregalo al carrito y seguí
                los pasos para completar tu compra.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-semibold">
                ¿Cómo puedo pagar?
              </h2>

              <p className="text-sm leading-7 text-gray-600">
                Actualmente podés seleccionar tarjeta de
                crédito o débito y transferencia bancaria.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-semibold">
                ¿Puedo cambiar un producto?
              </h2>

              <p className="text-sm leading-7 text-gray-600">
                Sí. Para conocer las condiciones,
                consultá nuestra sección de cambios y
                devoluciones.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-semibold">
                ¿Cómo consulto mi pedido?
              </h2>

              <p className="text-sm leading-7 text-gray-600">
                Una vez completada la compra recibirás la
                información correspondiente a tu pedido.
              </p>
            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default PreguntasFrecuentes;