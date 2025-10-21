import * as SecureStore from "expo-secure-store";
import api from "./api";
import { API_ENDPOINTS } from "../constants/api";
import { handleApiError } from "../utils/errorHandler";

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
      throw handleApiError(error);
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
      throw handleApiError(error);
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
      throw handleApiError(error);
    }
  },

  getToken: async () => {
    return await SecureStore.getItemAsync("userToken");
  },

  getUserData: async () => {
    const userData = await SecureStore.getItemAsync("userData");
    return userData ? JSON.parse(userData) : null;
  },

  updateProfile: async (name) => {
    try {
      const response = await api.put(API_ENDPOINTS.UPDATE_PROFILE, { name });
      // Keep local storage in sync with server
      await SecureStore.setItemAsync("userData", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post(API_ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
