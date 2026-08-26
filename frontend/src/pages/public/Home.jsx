import { Link } from "react-router-dom";

import heroImage from "../../assets/hero.png";
// TODO(limpiar): Reemplazar este import hardcodeado por una llamada a productApi.getProducts()
import products from "../../data/products";
import { trackCtaClick } from "../../utils/analytics";

const Home = () => {
  const handleCta = (cta, location) =>
    trackCtaClick({ cta, location });
  return (
    <>
      <main className="bg-white">
        {/* =========================
            HERO
        ========================== */}

        <section className="bg-[#e5e5e5]">
          <div className="mx-auto grid min-h-105 max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-2 md:px-8 md:py-16 lg:px-10">
            {/* TEXTO */}

            <div className="text-center md:text-left">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-norte-mustard">
                Nueva colección
              </p>

              <h1 className="mb-5 text-4xl font-normal leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Vestí tu actitud
              </h1>

              <p className="mx-auto mb-7 max-w-md text-sm leading-6 text-gray-600 md:mx-0">
                Descubrí la nueva colección NORTE y encontrá prendas pensadas
                para todos los días.
              </p>

              <Link
                to="/catalogo"
                onClick={() => handleCta("ver_catalogo", "hero")}
                className="inline-flex rounded-btn bg-norte-mustard px-6 py-3 text-xs font-medium text-white transition hover:-translate-y-0.5 hover:bg-mostaza-4"
              >
                Ver catálogo
              </Link>
            </div>

            {/* IMAGEN */}

            <div className="flex h-70 w-full items-center justify-center overflow-hidden md:h-85.5">
              <img
                src={heroImage}
                alt="Nueva colección NORTE"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* =========================
            EXPLORÁ NORTE
        ========================== */}

        <section className="mx-auto max-w-7xl px-6 py-14 md:px-8 md:py-20 lg:px-10">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-norte-mustard">
              Descubrí
            </p>

            <h2 className="text-3xl font-normal tracking-tight md:text-4xl">
              Explorá NORTE
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {["Remeras", "Camperas", "Pantalones"].map((categoria) => {
              const producto = products.find(
                (product) => product.category === categoria,
              );

              return (
                <Link
                  key={categoria}
                  to={`/catalogo?categoria=${encodeURIComponent(categoria)}`}
                  onClick={() => handleCta("ver_categoria", categoria)}
                  className="group overflow-hidden border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
                >
                  {/* IMAGEN */}

                  <div className="h-55 overflow-hidden bg-gray-100">
                    <img
                      src={producto?.image}
                      alt={categoria}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* INFORMACIÓN */}

                  <div className="p-5 text-center">
                    <h3 className="text-base font-medium">{categoria}</h3>

                    <p className="mt-1 text-xs text-gray-500 transition group-hover:text-norte-mustard">
                      Ver colección
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* =========================
            CTA
        ========================== */}

        <section className="border-t border-gray-200 bg-[#f7f7f7]">
          <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-14 text-center md:px-8 md:py-16 lg:px-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-norte-mustard">
              NORTE
            </p>

            <h2 className="text-2xl font-normal md:text-3xl">
              Encontrá tu próximo look
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
              Explorá nuestro catálogo y descubrí prendas para acompañarte todos
              los días.
            </p>

            <Link
              to="/catalogo"
              onClick={() => handleCta("explorar_catalogo", "cta_final")}
              className="mt-7 inline-flex rounded-btn border border-norte-mustard px-6 py-3 text-xs font-medium text-norte-mustard transition hover:bg-norte-mustard hover:text-white"
            >
              Explorar catálogo
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
