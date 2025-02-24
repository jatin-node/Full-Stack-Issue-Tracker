import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const savedAuth = localStorage.getItem("auth");
      return savedAuth ? JSON.parse(savedAuth) : { token: null, user: null };
    } catch (error) {
      console.error("Error parsing auth data from localStorage:", error);
      return { token: null, user: null };
    }
  });

  useEffect(() => {
    if (auth && auth.token) {
      localStorage.setItem("auth", JSON.stringify(auth));
    } else {
      localStorage.removeItem("auth"); // Clear storage if no valid auth
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
