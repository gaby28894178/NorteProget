import { Link, useParams } from "react-router-dom";

import products from "../../data/products";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import "./Producto.css";

const Producto = () => {
  const { id } = useParams();

  const product = products.find((product) => product.id === Number(id));

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="producto-page container">
          <h1>Producto no encontrado</h1>

          <Link to="/catalogo" className="producto-page__back">
            Volver al catálogo
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="producto-page">
        <section className="producto-detail container">
          {/* IMAGEN */}

          <div className="producto-detail__image">
            <img src={product.image} alt={product.name} />
          </div>

          {/* INFORMACIÓN */}

          <div className="producto-detail__info">
            <span className="producto-detail__category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <p className="producto-detail__description">
              {product.description}
            </p>

            <div className="producto-detail__price">
              ${product.price.toLocaleString("es-AR")}
            </div>

            <div className="producto-detail__actions">
              <Link
                to={`/checkout?producto=${product.id}`}
                className="producto-detail__buy"
              >
                Comprar ahora
              </Link>

              <Link to="/catalogo" className="producto-detail__back">
                Volver al catálogo
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Producto;
