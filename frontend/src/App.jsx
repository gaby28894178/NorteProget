import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Producto from "./pages/Producto";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Pago from "./pages/Pago";
import Confirmacion from "./pages/Confirmacion";

import CambiosDevoluciones from "./pages/CambiosDevoluciones";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";

function App() {
  return (
    <Routes>

      {/* PRINCIPALES */}

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
        path="/carrito"
        element={<Carrito />}
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

      {/* INFORMACIÓN */}

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

    </Routes>
  );
}

export default App;