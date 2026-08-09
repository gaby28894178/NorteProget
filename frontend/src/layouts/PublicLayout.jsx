import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navbar de la Tienda */}
      <header className="bg-white border-b p-4 text-center">
        <p className="font-bold"> NORTE </p>
      </header>

      {/* Contenido dinámico de las páginas públicas */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>

      {/* Footer de la Tienda */}
      <footer className="bg-gray-100 border-t p-4 text-center text-sm">
        NORTE E-Commerce © 2026
      </footer>
    </div>
  );
}
