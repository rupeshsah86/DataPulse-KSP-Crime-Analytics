"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { LoginRequest, RegisterRequest } from "@/services/authService";

export const useAuth = () => {
  const router = useRouter();
  const { setAuth, setLoading, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setAuth(
        {
          email: response.email,
          fullName: response.fullName,
          role: response.role as any,
        },
        response.token,
      );
      toast.success("Welcome back! 🎉");
      return true;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Login failed";
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await authService.register(data);
      toast.success("Registration successful! Please login.");
      return true;
    } catch (err: any) {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Registration failed";
      setError(message);
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    useAuthStore.getState().clearAuth();
    toast.success("Logged out");
    router.push("/login");
  };

  return { login, register, logout, isLoading, error };
};
