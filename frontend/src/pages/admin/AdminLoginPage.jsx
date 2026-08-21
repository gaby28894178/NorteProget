import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LuLoader, LuLock, LuMail } from "react-icons/lu";

import { useAuth } from "../../context/AuthContext";
import { trackLogin } from "../../utils/analytics";

export const AdminLoginPage = () => {
  const { adminLogin, isAdmin } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Si ya hay sesión admin activa, no tiene sentido ver el login.
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const from = location.state?.from || "/admin/dashboard";

  const onSubmit = async ({ email, password }) => {
    setError("");
    setLoading(true);

    try {
      await adminLogin({ email, password });
      trackLogin({ method: "admin_email" });
      navigate(from, { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          "No se pudo iniciar sesión. Intentá de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-norte-dark px-4 py-12">
      <section className="w-full max-w-110 rounded-card border border-white/10 bg-white p-6 shadow-2xl sm:p-10">
        {/* ENCABEZADO */}
        <div className="mb-8 text-center">
          <span className="inline-block bg-norte-mustard px-3 py-1 rounded-sm text-sm font-bold uppercase tracking-widest text-white mb-4">
            NORTE Admin
          </span>

          <h1 className="mb-2 text-3xl font-bold leading-tight text-norte-dark">
            Iniciar sesión
          </h1>

          <p className="text-sm leading-relaxed text-gray-600">
            Ingresá para administrar la tienda.
          </p>
        </div>

        {/* FORMULARIO */}
        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="admin-email"
              className="text-sm font-semibold text-norte-dark"
            >
              Email
            </label>

            <div className="relative">
              <LuMail
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-norte-stone"
                size={18}
              />
              <input
                type="email"
                id="admin-email"
                autoComplete="email"
                placeholder="soporte@norte.com"
                className="w-full rounded-sm border border-norte-stone bg-white py-3 pl-10 pr-4 text-sm text-norte-dark outline-none transition focus:border-norte-mustard focus:ring-2 focus:ring-mostaza/30"
                {...register("email", {
                  required: "El email es requerido.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingresá un email válido.",
                  },
                })}
              />
            </div>

            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* CONTRASEÑA */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="admin-password"
              className="text-sm font-semibold text-norte-dark"
            >
              Contraseña
            </label>

            <div className="relative">
              <LuLock
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-norte-stone"
                size={18}
              />
              <input
                type="password"
                id="admin-password"
                autoComplete="current-password"
                placeholder="Ingresá tu contraseña"
                className="w-full rounded-sm border border-norte-stone bg-white py-3 pl-10 pr-4 text-sm text-norte-dark outline-none transition focus:border-norte-mustard focus:ring-2 focus:ring-mostaza/30"
                {...register("password", {
                  required: "La contraseña es requerida.",
                })}
              />
            </div>

            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-btn bg-norte-mustard px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-mostaza-4 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <LuLoader size={16} className="animate-spin" /> : null}
            {loading ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>

        {/* VOLVER */}
        <Link
          to="/"
          className="mt-6 block text-center text-sm text-gray-600 transition hover:text-norte-mustard"
        >
          Volver a la tienda
        </Link>
      </section>
    </main>
  );
};
