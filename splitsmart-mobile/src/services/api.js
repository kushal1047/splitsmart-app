import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Set up axios instance with default config
const api = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically add auth token to all requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors by clearing stored tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear local storage
      await SecureStore.deleteItemAsync("userToken");
      await SecureStore.deleteItemAsync("userData");
    }
    return Promise.reject(error);
  }
);

export default api;
