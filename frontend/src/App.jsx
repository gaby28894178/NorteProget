import { useState } from "react";

function App() {
  const [selectedSize, setSelectedSize] = useState("M");

  return (
    <div className="min-h-screen bg-norte-bg text-norte-dark font-sans flex flex-col">
      {/* 1. Header con fondo oscuro y acentos */}
      <header className="bg-norte-dark text-norte-bg p-4 border-b border-norte-stone flex justify-between items-center px-8">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-norte-mustard">
          NORTE
        </h1>
        <nav className="flex gap-6 text-sm font-medium">
          <a href="#" className="hover:text-norte-mustard transition-colors">
            Catálogo
          </a>
          <a href="#" className="hover:text-norte-mustard transition-colors">
            Curaduría
          </a>
          <span className="bg-norte-forest text-norte-bg px-2 py-0.5 rounded text-xs">
            Carrito (1)
          </span>
        </nav>
      </header>

      {/* 2. Contenido Principal */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col gap-8">
        {/* Banner destacado con acento secundario (Verde Bosque) */}
        <section className="bg-norte-forest text-norte-bg p-4 rounded-lg flex justify-between items-center shadow-sm">
          <div>
            <p className="font-bold text-sm uppercase tracking-wide text-norte-stone">
              Colección Fin de Año
            </p>
            <h2 className="text-xl font-bold">
              Diseño local & edición limitada
            </h2>
          </div>
          <button className="bg-norte-mustard text-norte-dark px-4 py-2 rounded text-sm font-bold hover:opacity-90 transition-opacity">
            Ver Novedades
          </button>
        </section>

        {/* Card de Producto utilizando la paleta completa */}
        <section className="bg-white border border-norte-stone rounded-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 shadow-sm">
          {/* Mock Imagen */}
          <div className="bg-norte-stone rounded-lg h-64 flex items-center justify-center text-norte-dark font-bold text-sm uppercase">
            [ Imagen de Producto ]
          </div>

          {/* Info de Producto */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-semibold text-norte-forest tracking-wider">
                Ropa • Marca Propia
              </span>
              <h3 className="text-2xl font-bold uppercase text-norte-dark mt-1">
                Campera Norte Oversized
              </h3>
              <p className="text-xl font-extrabold text-norte-mustard mt-2">
                $45.000
              </p>
              <p className="text-sm text-norte-dark/80 mt-3 leading-relaxed">
                Confeccionada en gabardina pesada de algodón. Corte holgado con
                detalles de costura a la vista.
              </p>
            </div>

            {/* Selector de Talles */}
            <div className="mt-4">
              <label className="text-xs font-bold uppercase text-norte-dark block mb-2">
                Talle:
              </label>
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-10 h-10 text-sm font-bold rounded border transition-all ${
                      selectedSize === size
                        ? "bg-norte-dark text-norte-bg border-norte-dark"
                        : "bg-norte-bg text-norte-dark border-norte-stone hover:border-norte-forest"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Botón Principal de Acción  */}
            <button className="mt-6 w-full bg-norte-mustard text-norte-dark font-bold py-3 px-4 rounded-lg hover:brightness-95 transition-all shadow-sm">
              Agregar al Carrito
            </button>
          </div>
        </section>
      </main>

      {/* 3. Footer  */}
      <footer className="border-t border-norte-stone p-6 text-center text-xs text-norte-dark/70 bg-norte-bg">
        NORTE © 2026 — Indumentaria & Curaduría de diseño local.
      </footer>
    </div>
  );
}

export default App;
