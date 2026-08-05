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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  badgeNumber: string;
  department: string;
  rankName?: string;
  policeStation: string;
  district?: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  policeStation?: string;
  badgeNumber?: string;
  department?: string;
  rankName?: string;
  district?: string;
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
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    const {
      token,
      email,
      role,
      fullName,
      firstName,
      lastName,
      phoneNumber,
      policeStation,
      badgeNumber,
      department,
      rankName,
      district,
    } = response.data;

    setToken(token);
    setUser({
      email,
      fullName,
      firstName,
      lastName,
      role,
      phoneNumber: phoneNumber || "",
      policeStation: policeStation || "",
      badgeNumber: badgeNumber || "",
      department: department || "",
      rankName: rankName || "",
      district: district || "",
    });

    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  logout: (): void => {
    removeToken();
    removeUser();
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("datapulse_token");
  },
};
