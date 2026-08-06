import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold border-b border-slate-700 pb-2">
          NORTE Admin
        </h2>
        <nav className="flex flex-col gap-3">
          <Link to="/admin/dashboard" className="hover:text-blue-400">
            📊 Dashboard
          </Link>
          <Link to="/admin/productos" className="hover:text-blue-400">
            📦 Productos
          </Link>
          <Link to="/admin/categorias" className="hover:text-blue-400">
            🏷️ Categorías
          </Link>
          <Link to="/admin/pedidos" className="hover:text-blue-400">
            🛒 Pedidos
          </Link>
        </nav>
      </aside>

      {/* Área de trabajo del Admin */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
