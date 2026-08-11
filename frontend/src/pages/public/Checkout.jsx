import { useState } from "react";
import { useSearchParams, Link, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import products from "../../data/products";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import "./Checkout.css";

const Checkout = () => {
  const [searchParams] = useSearchParams();

  const productoId = Number(searchParams.get("producto"));

  const product = products.find((product) => product.id === productoId);

  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    codigoPostal: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Datos de compra:", formData);

    navigate(`/pago?producto=${productoId}`);
  };

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="checkout-page container">
          <div className="checkout-message">
            <h1>Producto no encontrado</h1>

            <Link to="/catalogo">Volver al catálogo</Link>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{
          from: `/checkout?producto=${productoId}`,
        }}
        replace
      />
    );
  }

  return (
    <>
      <Navbar />

      <main className="checkout-page">
        <section className="checkout container">
          <div className="checkout__header">
            <p>FINALIZAR COMPRA</p>

            <h1>Datos de compra</h1>

            <span>Completá tus datos para continuar.</span>
          </div>

          <div className="checkout__grid">
            <aside className="checkout__product">
              <div className="checkout__product-image">
                <img src={product.image} alt={product.name} />
              </div>

              <div className="checkout__product-info">
                <span>{product.category}</span>

                <h2>{product.name}</h2>

                <p>{product.description}</p>

                <strong>${product.price.toLocaleString("es-AR")}</strong>

                <div className="checkout__total">
                  <span>Total</span>

                  <strong>${product.price.toLocaleString("es-AR")}</strong>
                </div>
              </div>
            </aside>

            <section className="checkout__form-container">
              <h2>Información del comprador</h2>

              <form className="checkout__form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>

                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>

                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>

                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group form-group--full">
                  <label htmlFor="direccion">Dirección</label>

                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ciudad">Ciudad</label>

                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={formData.ciudad}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="codigoPostal">Código postal</label>

                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="checkout__button">
                  Continuar con la compra
                </button>
              </form>

              <Link to="/catalogo" className="checkout__back">
                Volver al catálogo
              </Link>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Checkout;
