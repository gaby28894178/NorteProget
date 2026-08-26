import { useState } from "react";
import {
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { trackLogin } from "../../utils/analytics";


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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Completá todos los campos.");
      return;
    }

    try {
      await login(formData);
      trackLogin({ method: "email" });
      navigate(from, {
        replace: true,
      });
    } catch (loginError) {
      setError(
        loginError.response?.data?.message ||
          "No pudimos iniciar sesión. Revisá tus credenciales.",
      );
    }
  };

  return (
    <>

      <main className="flex min-h-[75vh] items-center justify-center bg-norte-bg px-4 py-12 sm:px-6 sm:py-20">

        <section className="w-full max-w-115 rounded-card border border-norte-stone bg-white p-6 shadow-md sm:p-10">

          {/* =========================
              ENCABEZADO
          ========================== */}

          <div className="mb-8 text-center">

            <p className="mb-3 text-[0.75rem] font-bold tracking-[0.18em] text-norte-mustard">
              BIENVENIDO A NORTE
            </p>

            <h1 className="mb-3 text-3xl font-bold leading-tight sm:text-[2.3rem]">
              Iniciar sesión
            </h1>

            <span className="text-sm leading-relaxed text-gray-600">
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
              <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* EMAIL */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="email"
                className="text-sm font-semibold text-norte-dark"
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
                className="w-full rounded-sm border border-norte-stone bg-white px-4 py-3 text-sm text-norte-dark outline-none transition focus:border-norte-mustard focus:ring-2 focus:ring-black/5"
              />

            </div>

            {/* CONTRASEÑA */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="password"
                className="text-sm font-semibold text-norte-dark"
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
                className="w-full rounded-sm border border-norte-stone bg-white px-4 py-3 text-sm text-norte-dark outline-none transition focus:border-norte-mustard focus:ring-2 focus:ring-black/5"
              />

            </div>

            {/* BOTÓN */}

            <button
              type="submit"
              className="mt-2 w-full rounded-btn bg-norte-mustard px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-mostaza-4"
            >
              Iniciar sesión
            </button>

          </form>

          {/* VOLVER */}

          <Link
            to="/catalogo"
            className="mt-6 block text-center text-sm text-gray-600 transition hover:text-norte-mustard"
          >
            Volver al catálogo
          </Link>

        </section>

      </main>

    </>
  );
};

export default Login;
