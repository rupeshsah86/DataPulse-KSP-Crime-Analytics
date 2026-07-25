import axios from "axios";

// Get API URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// ============================================
// REQUEST INTERCEPTOR - Add JWT Token
// ============================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("datapulse_token");

    // ✅ ADD THESE LOGS
    console.log("🔍 ========== REQUEST ==========");
    console.log("🔍 URL:", (config.baseURL || "") + config.url);
    console.log("🔍 Method:", config.method);
    console.log("🔍 Token exists?", !!token);
    console.log("🔍 Token preview:", token?.substring(0, 30) + "...");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔍 ✅ Authorization header added");
    } else {
      console.log("🔍 ❌ No token found!");
    }

    return config;
  },
  (error) => {
    console.log("❌ Request error:", error);
    return Promise.reject(error);
  },
);

// ============================================
// RESPONSE INTERCEPTOR - Handle 401 Errors
// ============================================
api.interceptors.response.use(
  (response) => {
    // ✅ ADD THIS LOG
    console.log("✅ ========== RESPONSE ==========");
    console.log("✅ Status:", response.status);
    console.log("✅ URL:", response.config.url);
    return response;
  },
  (error) => {
    // ✅ ADD THESE LOGS
    console.log("❌ ========== ERROR RESPONSE ==========");
    console.log("❌ Status:", error.response?.status);
    console.log("❌ URL:", error.response?.config?.url);
    console.log("❌ Message:", error.message);

    // If 401 Unauthorized, redirect to login
    if (error.response?.status === 401) {
      console.log("❌ 🔴 401 Unauthorized! Redirecting to login...");
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
