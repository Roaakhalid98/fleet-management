// src/lib/apiClient.js
import axios from "axios";
import { logout } from "./authHelpers";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
});

// Only run interceptors in the browser
if (typeof window !== "undefined") {
  // Add token to every request
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Global response handler
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout(); // log user out globally on 401
      }
      return Promise.reject(error);
    }
  );
}

export default apiClient;
