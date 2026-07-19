import axios from "axios";

// Get API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // ✅ CHANGED FROM 30000 TO 60000 (60 seconds)
});

// ============================================
// REQUEST INTERCEPTOR - Add JWT Token
// ============================================
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("datapulse_token")
        : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ============================================
// RESPONSE INTERCEPTOR - Handle 401 Errors
// ============================================
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If 401 Unauthorized, redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("datapulse_token");
        localStorage.removeItem("datapulse_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default api;
