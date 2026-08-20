import { createContext, useContext, useState } from "react";
import { adminLogin as adminLoginRequest } from "../api/authApi";

const AuthContext = createContext();

const readStorage = (key) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStorage("norte-user"));
  const [admin, setAdmin] = useState(() => readStorage("norte-admin-user"));

  // Login público (cliente) — demo sin endpoint por ahora.
  const login = (userData) => {
    localStorage.setItem("norte-user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("norte-user");
    setUser(null);
  };

  // Login admin (panel): llama a la API de auth (mock o endpoint real) y
  // guarda el token + usuario en localStorage para las rutas privadas.
  const adminLogin = async ({ email, password }) => {
    const { token, user } = await adminLoginRequest({ email, password });

    localStorage.setItem("token", token);
    localStorage.setItem("norte-admin-user", JSON.stringify(user));

    setAdmin(user);
    return user;
  };

  const adminLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("norte-admin-user");
    setAdmin(null);
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = Boolean(admin);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        admin,
        adminLogin,
        adminLogout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  return useContext(AuthContext);
};