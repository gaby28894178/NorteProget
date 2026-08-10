import { Link } from "react-router-dom";
import "./Home.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}

        <section className="hero">
          <div className="hero__content">
            <p className="hero__eyebrow">ESTILO · CALIDAD · NORTE</p>

            <h1 className="hero__title">Descubrí tu próximo favorito.</h1>

            <p className="hero__description">
              Productos seleccionados para quienes buscan calidad, diseño y una
              experiencia de compra simple.
            </p>

            <Link to="/catalogo" className="hero__button">
              Ver catálogo
            </Link>
          </div>
        </section>

        {/* PRESENTACIÓN */}

        <section className="home-intro container">
          <p className="home-intro__eyebrow">BIENVENIDO A NORTE</p>

          <h2>Una selección pensada para vos.</h2>

          <p>
            Explorá nuestro catálogo y encontrá productos elegidos para combinar
            funcionalidad, calidad y estilo.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Home;
