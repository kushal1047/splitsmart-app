import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

// Create auth context for managing user state across the app
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in when app starts
  useEffect(() => {
    checkAuth();
  }, []);

  // Try to restore user session from secure storage
  const checkAuth = async () => {
    try {
      const token = await authService.getToken();
      if (token) {
        const userData = await authService.getUserData();
        setUser(userData);
      }
    } catch (error) {
      console.log("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user login
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Handle user registration
  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Clear user data and log out
  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  // Update user profile information
  const updateProfile = async (name) => {
    try {
      const updatedUser = await authService.updateProfile(name);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
