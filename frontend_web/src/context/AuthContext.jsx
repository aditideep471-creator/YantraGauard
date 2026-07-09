import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // ✅ SAFE LOAD USER FROM STORAGE
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  // ✅ LOGIN
  const login = (userData, token) => {
    if (!userData || !token) return;

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access_token", token);

    setUser(userData);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

    

export const useAuth = () => useContext(AuthContext);