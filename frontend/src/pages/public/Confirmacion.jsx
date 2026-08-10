import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Confirmacion = () => {
  return (
    <>
      <Navbar />

      <main className="confirmacion-page">
        <section className="confirmacion-container">
          <div className="confirmacion-icon">✓</div>

          <p className="confirmacion-eyebrow">COMPRA COMPLETADA</p>

          <h1>¡Compra realizada!</h1>

          <p className="confirmacion-text">
            Tu pago fue procesado correctamente.
          </p>

          <p className="confirmacion-thanks">Gracias por comprar en NORTE.</p>

          <Link to="/" className="confirmacion-button">
            Volver al inicio
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Confirmacion;
