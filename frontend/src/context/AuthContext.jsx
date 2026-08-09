import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("norte-user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const login = (userData) => {
    localStorage.setItem(
      "norte-user",
      JSON.stringify(userData)
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("norte-user");

    setUser(null);
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated
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