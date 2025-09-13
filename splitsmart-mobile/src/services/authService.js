import * as SecureStore from "expo-secure-store";
import api from "./api";
import { API_ENDPOINTS } from "../constants/api";

export const authService = {
  register: async (name, email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, {
        name,
        email,
        password,
      });

      if (response.data.token) {
        await SecureStore.setItemAsync("userToken", response.data.token);
        await SecureStore.setItemAsync(
          "userData",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      if (response.data.token) {
        await SecureStore.setItemAsync("userToken", response.data.token);
        await SecureStore.setItemAsync(
          "userData",
          JSON.stringify(response.data.user)
        );
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("userToken");
    await SecureStore.deleteItemAsync("userData");
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ME);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getToken: async () => {
    return await SecureStore.getItemAsync("userToken");
  },

  getUserData: async () => {
    const userData = await SecureStore.getItemAsync("userData");
    return userData ? JSON.parse(userData) : null;
  },
};
