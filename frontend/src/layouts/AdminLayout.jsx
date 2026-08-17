import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuMenu,
  LuPackage,
  LuShoppingCart,
  LuTags,
  LuX,
} from "react-icons/lu";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="admin-root flex min-h-screen bg-norte-bg">
      {/* Overlay para el drawer en móvil */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-norte-dark text-white p-6 flex flex-col gap-6 transform transition-transform lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2 className="bg-norte-mustard text-xl font-bold p-1 rounded-sm">
            NORTE Admin
          </h2>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-norte-mustard hover:text-white"
            aria-label="Cerrar menú"
          >
            <LuX size={22} />
          </button>
        </div>
        <nav className="flex flex-col gap-3">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 hover:text-norte-mustard"
          >
            <LuLayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            to="/admin/productos"
            className="flex items-center gap-3 hover:text-norte-mustard"
          >
            <LuPackage size={18} />
            Productos
          </Link>
          <Link
            to="/admin/categorias"
            className="flex items-center gap-3 hover:text-norte-mustard"
          >
            <LuTags size={18} />
            Categorías
          </Link>
          <Link
            to="/admin/pedidos"
            className="flex items-center gap-3 hover:text-norte-mustard"
          >
            <LuShoppingCart size={18} />
            Pedidos
          </Link>
        </nav>
      </aside>

      {/* Área de trabajo del Admin */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar móvil */}
        <header className="lg:hidden flex items-center justify-between bg-norte-dark text-white px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-norte-mustard hover:text-white"
            aria-label="Abrir menú"
          >
            <LuMenu size={24} />
          </button>
          <h2 className="font-bold">NORTE Admin</h2>
          <span className="w-6" />
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
