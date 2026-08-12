import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import "./Login.css";
const Login = () => {
  const { login } = useAuth();

  const navigate = useNavigate();

  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const from = location.state?.from || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Completá todos los campos.");

      return;
    }

    const userData = {
      email: formData.email,
    };

    login(userData);

    navigate(from, {
      replace: true,
    });
  };

  return (
    <>
      <Navbar />

      <main className="login-page">
        <section className="login-container">
          <div className="login-header">
            <p>BIENVENIDO A NORTE</p>

            <h1>Iniciar sesión</h1>

            <span>Ingresá para continuar con tu compra.</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            <div className="login-field">
              <label htmlFor="email">Email</label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Contraseña</label>

              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresá tu contraseña"
                required
              />
            </div>

            <button type="submit" className="login-button">
              Iniciar sesión
            </button>
          </form>

          <Link to="/catalogo" className="login-back">
            Volver al catálogo
          </Link>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Login;
