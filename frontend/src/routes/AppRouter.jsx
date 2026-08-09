import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

// Vistas públicas - sirven como placeholders mientras se desarrolla la tienda
const Home = () => <div>Catálogo de Productos (En construcción)</div>;
const Cart = () => <div>Carrito de Compras (En construcción)</div>;

// Vistas de Admin - sirven como placeholders mientras se desarrolla el panel de administración
const Dashboard = () => <div>Dashboard de Métricas</div>;
const Products = () => <div>Gestión de Productos (CRUD)</div>;
const Categories = () => <div>Gestión de Categorías</div>;
const Orders = () => <div>Gestión de Pedidos</div>;

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (Tienda) */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="carrito" element={<Cart />} />
        </Route>

        {/* Rutas Privadas (Admin) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="productos" element={<Products />} />
          <Route path="categorias" element={<Categories />} />
          <Route path="pedidos" element={<Orders />} />
        </Route>

        {/* Redirección para rutas no encontradas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
