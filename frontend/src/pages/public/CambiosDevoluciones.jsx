
const CambiosDevoluciones = () => {
  return (
    <>

      <main className="min-h-[70vh] bg-white px-6 py-16">

        <section className="mx-auto max-w-3xl">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#a86620]">
            NORTE
          </p>

          <h1 className="text-3xl font-normal">
            Cambios y devoluciones
          </h1>

          <div className="mt-10 space-y-8 text-sm leading-7 text-gray-600">

            <div>
              <h2 className="mb-2 text-base font-semibold text-black">
                Cambios
              </h2>

              <p>
                Podés solicitar el cambio de un producto
                dentro del plazo establecido, siempre que
                se encuentre sin uso y en las mismas
                condiciones en las que fue entregado.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-semibold text-black">
                Devoluciones
              </h2>

              <p>
                Para solicitar una devolución, contactate
                con nuestro equipo indicando el número de
                pedido y el motivo de la solicitud.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-semibold text-black">
                Condiciones
              </h2>

              <p>
                Los productos deben conservar sus etiquetas
                y encontrarse en perfecto estado.
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-base font-semibold text-black">
                Consultas
              </h2>

              <p>
                Si tenés alguna duda sobre cambios o
                devoluciones, podés comunicarte con
                nuestro equipo.
              </p>
            </div>

          </div>

        </section>

      </main>

    </>
  );
};

export default CambiosDevoluciones;