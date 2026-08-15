import { useState } from "react";
import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

      <main className="flex min-h-[75vh] items-center justify-center bg-[var(--color-secondary)] px-4 py-12 sm:px-6 sm:py-20">

        <section className="w-full max-w-[460px] rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-md)] sm:p-10">

          {/* =========================
              ENCABEZADO
          ========================== */}

          <div className="mb-8 text-center">

            <p className="mb-3 text-[0.75rem] font-bold tracking-[0.18em] text-[var(--color-accent)]">
              BIENVENIDO A NORTE
            </p>

            <h1 className="mb-3 text-3xl font-bold leading-tight sm:text-[2.3rem]">
              Iniciar sesión
            </h1>

            <span className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
              Ingresá para continuar con tu compra.
            </span>

          </div>

          {/* =========================
              FORMULARIO
          ========================== */}

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
          >

            {/* ERROR */}

            {error && (
              <div className="rounded-[var(--radius-sm)] border border-[#e0e0e0] bg-[#f5f5f5] px-4 py-3 text-sm text-[#b00020]">
                {error}
              </div>
            )}

            {/* EMAIL */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="email"
                className="text-sm font-semibold text-[var(--color-text)]"
              >
                Email
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                required
                className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-black/5"
              />

            </div>

            {/* CONTRASEÑA */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="password"
                className="text-sm font-semibold text-[var(--color-text)]"
              >
                Contraseña
              </label>

              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresá tu contraseña"
                required
                className="w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-black/5"
              />

            </div>

            {/* BOTÓN */}

            <button
              type="submit"
              className="mt-2 w-full rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-4 py-4 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] hover:shadow-[var(--shadow-md)]"
            >
              Iniciar sesión
            </button>

          </form>

          {/* VOLVER */}

          <Link
            to="/catalogo"
            className="mt-6 block text-center text-sm text-[var(--color-text-secondary)] transition hover:text-[var(--color-accent)]"
          >
            Volver al catálogo
          </Link>

        </section>

      </main>

      <Footer />
    </>
  );
};

export default Login;