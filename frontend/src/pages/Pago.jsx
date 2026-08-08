


import { useState } from "react";
import {
  useNavigate,
  useSearchParams,
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Pago.css";
const Pago = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const productoId = searchParams.get("producto");

  const [metodoPago, setMetodoPago] = useState("");

  const [procesando, setProcesando] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!metodoPago) {
      return;
    }

    setProcesando(true);

    setTimeout(() => {
      setProcesando(false);

      navigate(
        `/confirmacion?producto=${productoId}`
      );
    }, 1500);
  };

  return (
    <>
      <Navbar />

      <main className="pago-page">

        <section className="pago-container">

          <div className="pago-header">

            <p>FINALIZAR COMPRA</p>

            <h1>Realizar pago</h1>

            <span>
              Seleccioná un método de pago para
              continuar.
            </span>

          </div>

          <form
            className="pago-form"
            onSubmit={handleSubmit}
          >

            <div className="pago-field">

              <label htmlFor="metodoPago">
                Método de pago
              </label>

              <select
                id="metodoPago"
                value={metodoPago}
                onChange={(event) =>
                  setMetodoPago(event.target.value)
                }
                required
              >
                <option value="">
                  Seleccionar método
                </option>

                <option value="tarjeta">
                  Tarjeta de crédito o débito
                </option>

                <option value="transferencia">
                  Transferencia bancaria
                </option>

              </select>

            </div>

            <button
              type="submit"
              className="pago-button"
              disabled={procesando}
            >
              {procesando
                ? "Procesando pago..."
                : "Pagar"}
            </button>

          </form>

          <Link
            to="/catalogo"
            className="pago-back"
          >
            Volver al catálogo
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Pago;

