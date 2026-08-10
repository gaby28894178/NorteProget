import { useState } from "react";
import { Link } from "react-router-dom";

import products from "../../data/products";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import "./Catalogo.css";

const Catalogo = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  const categorias = [
    "Todas",
    ...new Set(products.map((product) => product.category)),
  ];

  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? products
      : products.filter(
          (product) => product.category === categoriaSeleccionada,
        );

  return (
    <>
      <Navbar />

      <main className="catalogo">
        {/* ENCABEZADO */}

        <section className="catalogo__header container">
          <p className="catalogo__eyebrow">COLECCIÓN NORTE</p>

          <h1>Catálogo</h1>

          <p>Explorá nuestra selección de productos.</p>
        </section>

        {/* CATEGORÍAS */}

        <section className="catalogo__categorias container">
          <h2>Categorías</h2>

          <div className="categorias__lista">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                className={
                  categoriaSeleccionada === categoria
                    ? "categoria__button active"
                    : "categoria__button"
                }
                onClick={() => setCategoriaSeleccionada(categoria)}
              >
                {categoria}
              </button>
            ))}
          </div>
        </section>

        {/* PRODUCTOS */}

        <section className="catalogo__productos container">
          <div className="productos__grid">
            {productosFiltrados.map((product) => (
              <article key={product.id} className="producto-card">
                <div className="producto-card__image">
                  <img src={product.image} alt={product.name} />
                </div>

                <div className="producto-card__content">
                  <span>{product.category}</span>

                  <h2>{product.name}</h2>

                  <p>{product.description}</p>

                  <strong>${product.price.toLocaleString("es-AR")}</strong>

                  <Link
                    to={`/producto/${product.id}`}
                    className="producto-card__button"
                  >
                    Ver producto
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Catalogo;
