

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Producto from "./pages/Producto";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Pago from "./pages/Pago";
import Confirmacion from "./pages/Confirmacion";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/catalogo"
              element={<Catalogo />}
            />

            <Route
              path="/producto/:id"
              element={<Producto />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/pago"
              element={<Pago />}
            />

            <Route
              path="/confirmacion"
              element={<Confirmacion />}
            />

          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

