import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import { FaShoppingCart, FaSearch, FaUser } from "react-icons/fa";

import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");

  // =========================
  // BUSCAR PRODUCTO
  // =========================

  const handleBuscar = (event) => {
    event.preventDefault();

    const texto = busqueda.trim();

    if (!texto) {
      navigate("/catalogo");
      return;
    }

    navigate(`/catalogo?buscar=${encodeURIComponent(texto)}`);
  };

  // =========================
  // CAMBIO DEL BUSCADOR
  // =========================

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      {/* =========================
          HEADER PRINCIPAL
      ========================== */}

      <div className="mx-auto flex min-h-19 max-w-7xl items-center justify-between gap-6 px-6 lg:px-8">
        {/* LOGO */}

        <Link
          to="/"
          className="shrink-0 text-2xl font-bold tracking-[0.22em] text-black"
        >
          NORTE
        </Link>

        {/* =========================
            BUSCADOR
        ========================== */}

        <form
          onSubmit={handleBuscar}
          className="hidden w-full max-w-70 md:block"
        >
          <div className="flex h-9.5 items-center rounded-lg border border-gray-200 bg-white px-3 transition focus-within:border-norte-mustard">
            <input
              type="search"
              value={busqueda}
              onChange={handleBusquedaChange}
              placeholder="Buscar productos"
              aria-label="Buscar productos"
              className="w-full bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              aria-label="Buscar"
              className="ml-2 flex shrink-0 items-center justify-center text-gray-700 transition hover:text-norte-mustard"
            >
              <FaSearch className="text-xs" />
            </button>
          </div>
        </form>

        {/* =========================
            CUENTA + CARRITO
        ========================== */}

        <div className="flex shrink-0 items-center gap-5">
          {/* MI CUENTA */}

          <Link
            to="/login"
            className="hidden items-center gap-1.5 text-xs text-black transition-opacity hover:opacity-60 sm:flex"
          >
            <FaUser className="text-[11px]" />

            <span>Mi cuenta</span>
          </Link>

          {/* CARRITO */}

          <Link
            to="/carrito"
            aria-label={`Carrito con ${totalItems} productos`}
            className="relative flex items-center text-sm text-black transition-opacity hover:opacity-60"
          >
            <FaShoppingCart />

            {totalItems > 0 && (
              <span className="absolute -right-3 -top-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-norte-mustard px-1 text-[9px] font-semibold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* =========================
          NAVEGACIÓN
      ========================== */}

      <nav className="border-t border-gray-100">
        <div className="mx-auto flex min-h-14.5 max-w-7xl items-center justify-center gap-10 px-6 lg:px-8">
          {/* CATÁLOGO */}

          <NavLink
            to="/catalogo"
            className={({ isActive }) =>
              `relative py-4 text-sm text-black transition-colors ${
                isActive
                  ? "font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-norte-mustard"
                  : "hover:text-norte-mustard"
              }`
            }
          >
            Catálogo
          </NavLink>

          {/* CAMBIOS Y DEVOLUCIONES */}

          <NavLink
            to="/cambios-devoluciones"
            className={({ isActive }) =>
              `relative py-4 text-sm text-black transition-colors ${
                isActive
                  ? "font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-norte-mustard"
                  : "hover:text-norte-mustard"
              }`
            }
          >
            Cambios y devoluciones
          </NavLink>

          {/* PREGUNTAS FRECUENTES */}

          <NavLink
            to="/preguntas-frecuentes"
            className={({ isActive }) =>
              `relative py-4 text-sm text-black transition-colors ${
                isActive
                  ? "font-semibold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-norte-mustard"
                  : "hover:text-norte-mustard"
              }`
            }
          >
            Preguntas frecuentes
          </NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
