import axios from "axios";

// Get API URL from environment variables (Default to Spring Boot port 8083)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000, // 8 second timeout max to prevent long hanging UI requests
});

// ============================================
// REQUEST INTERCEPTOR - Add JWT Token
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("datapulse_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ============================================
// RESPONSE INTERCEPTOR - Handle 401 Errors
// ============================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("datapulse_token");
      localStorage.removeItem("datapulse_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
