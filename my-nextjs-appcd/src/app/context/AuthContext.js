"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Create the AuthContext
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      // Validate the token with the server
      const validateToken = async () => {
        try {
          const response = await fetch("/api/auth/validate-token", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error("Token validation failed");
          }

          const data = await response.json();

          if (data.success) {
            setIsAuthenticated(true);
            setUser(data.user);
          } else {
            setIsAuthenticated(false);
            setUser(null);
            localStorage.removeItem("authToken"); // Clean up invalid token
          }
        } catch (err) {
          setIsAuthenticated(false);
          setUser(null);
          setError(err.message);
        } finally {
          setLoading(false); // Stop loading once the validation is done
        }
      };

      validateToken();
    } else {
      setLoading(false); // No token, skip validation
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("authToken", token);
    setIsAuthenticated(true);
    setUser(userData);
    setError(null);
    if (typeof window !== "undefined") {
      const router = require("next/router").useRouter(); // Use useRouter after ensuring we're on client
      router.push("/");
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading, error }}
    >
      {!loading && children} {/* Only render children when not loading */}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
