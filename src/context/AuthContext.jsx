import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";


// Create the context
const AuthContext = createContext();

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); //Add loading state

  // Check authentication on initial load
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      setIsAuthenticated(true); // Set authenticated if token exists
	  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`; //ensuring token is attached after refresh
    }
	setLoading(false); //Finish loading after checking token
  }, []);

  // Login function
  const login = (token) => {
    localStorage.setItem("auth_token", token);
	axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("auth_token");
	delete axios.defaults.headers.common["Authorization"];
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access to the auth context
export const useAuth = () => useContext(AuthContext);
