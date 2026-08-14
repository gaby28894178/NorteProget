import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

// Páginas públicas (tienda)
import Home from "../pages/public/Home";
import Catalogo from "../pages/public/Catalogo";
import Producto from "../pages/public/Producto";
import Checkout from "../pages/public/Checkout";
import Login from "../pages/public/Login";
import Pago from "../pages/public/Pago";
import Confirmacion from "../pages/public/Confirmacion";

// Vistas de Admin
import { AdminCategoriesPage } from "../pages/admin/AdminCategoriesPage";
import { AdminProductsPage } from "../pages/admin/AdminProductsPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";

// Vistas de Admin (placeholders pendientes de implementar)
const Dashboard = () => <div>Dashboard de Métricas</div>;

// Carrito (placeholder: la tienda aún no tiene la página de carrito)
const Cart = () => <div>Carrito de Compras (En construcción)</div>;

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (Tienda) */}
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/producto/:id" element={<Producto />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/confirmacion" element={<Confirmacion />} />
        <Route path="/carrito" element={<PublicLayout />}>
          <Route index element={<Cart />} />
        </Route>

        {/* TODO(auth): envolver con <PrivateRoute> cuando exista login.
            Por ahora las rutas admin quedan abiertas. */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="productos" element={<AdminProductsPage />} />
          <Route path="categorias" element={<AdminCategoriesPage />} />
          <Route path="pedidos" element={<AdminOrdersPage />} />
        </Route>

        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
