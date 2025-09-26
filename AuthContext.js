import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");

    if (token && userEmail) {
      setIsAuthenticated(true);
      setUser({ email: userEmail });
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);

      // Simulate API call - replace with your actual authentication logic
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock authentication - replace with real validation
      if (email && password.length >= 6) {
        localStorage.setItem("authToken", "demo-token-" + Date.now());
        localStorage.setItem("userEmail", email);

        setIsAuthenticated(true);
        setUser({ email });
        setIsLoading(false);

        return { success: true };
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
