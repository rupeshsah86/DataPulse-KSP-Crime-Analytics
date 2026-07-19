import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  email: string;
  fullName: string;
  role: "ADMIN" | "OFFICER" | "ANALYST" | "INVESTIGATOR";
  phoneNumber?: string; // ✅ Added
  policeStation?: string; // ✅ Added
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),

      setLoading: (loading) =>
        set({
          isLoading: loading,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
