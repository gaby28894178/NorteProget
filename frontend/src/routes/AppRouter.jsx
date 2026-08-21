import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { useEffect } from "react";

import { initGA, logPageView } from "../utils/analytics";

// Layouts
import PublicLayout from "../layouts/PublicLayout";
import AdminLayout from "../layouts/AdminLayout";

// Páginas públicas
import Home from "../pages/public/Home";
import Catalogo from "../pages/public/Catalogo";
import Producto from "../pages/public/Producto";
import Carrito from "../pages/public/Carrito";
import Checkout from "../pages/public/Checkout";
import Login from "../pages/public/Login";
import Pago from "../pages/public/Pago";
import Confirmacion from "../pages/public/Confirmacion";
import CambiosDevoluciones from "../pages/public/CambiosDevoluciones";
import PreguntasFrecuentes from "../pages/public/PreguntasFrecuentes";

// Vistas de Admin
import { AdminLoginPage } from "../pages/admin/AdminLoginPage";
import { AdminCategoriesPage } from "../pages/admin/AdminCategoriesPage";
import { AdminProductsPage } from "../pages/admin/AdminProductsPage";
import { AdminOrdersPage } from "../pages/admin/AdminOrdersPage";
import { AdminDashboardPage } from "../pages/admin/AdminDashboardPage";
import RequireAdmin from "../components/admin/RequireAdmin";

// Componente helper para escuchar los cambios de ruta
function AnalyticsTracker() {
  const location = useLocation();

  // Initializar GA4 una sola vez
  useEffect(() => {
    initGA();
  }, []);

  // Rastrear cada cambio de vista/URL
  useEffect(() => {
    logPageView(location.pathname + location.search);
  }, [location]);

  return null; // No renderiza nada en la UI
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* Tracker dentro de BrowserRouter para poder usar useLocation */}
      <AnalyticsTracker />
      <Routes>
        {/* =====================================
            RUTAS PÚBLICAS
        ====================================== */}

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />

          <Route path="/catalogo" element={<Catalogo />} />

          <Route path="/producto/:id" element={<Producto />} />

          <Route path="/carrito" element={<Carrito />} />

          <Route path="/checkout" element={<Checkout />} />

          <Route path="/login" element={<Login />} />

          <Route path="/pago" element={<Pago />} />

          <Route path="/confirmacion" element={<Confirmacion />} />

          <Route
            path="/cambios-devoluciones"
            element={<CambiosDevoluciones />}
          />

          <Route
            path="/cambiosdevoluciones"
            element={<CambiosDevoluciones />}
          />

          <Route
            path="/preguntas-frecuentes"
            element={<PreguntasFrecuentes />}
          />

          <Route
            path="/preguntasfrecuentes"
            element={<PreguntasFrecuentes />}
          />
        </Route>

        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Rutas protegidas del panel admin (RequireAdmin redirige a /admin/login) */}
        <Route path="/admin" element={<RequireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="productos" element={<AdminProductsPage />} />
            <Route path="categorias" element={<AdminCategoriesPage />} />
            <Route path="pedidos" element={<AdminOrdersPage />} />
          </Route>
        </Route>

        {/* =====================================
            RUTA NO ENCONTRADA
        ====================================== */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
