import api from "./api";
import { setToken, setUser, removeToken, removeUser } from "@/utils/storage";

// ============================================
// TYPES
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  employeeId?: string;
  policeStation?: string;
  phoneNumber?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  fullName: string;
  phoneNumber?: string; // ✅ Added
  policeStation?: string; // ✅ Added
}

export interface RegisterResponse {
  message: string;
  email: string;
  role: string;
}

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  /**
   * Login user and store token
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    const { token, email, role, fullName, phoneNumber, policeStation } =
      response.data;

    // Store in localStorage
    setToken(token);
    setUser({
      email,
      fullName,
      role,
      phoneNumber: phoneNumber || "",
      policeStation: policeStation || "",
    });

    return response.data;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: (): void => {
    removeToken();
    removeUser();
    // Optional: redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("datapulse_token");
  },
};
