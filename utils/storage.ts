// ============================================
// LOCAL STORAGE HELPERS
// ============================================

const TOKEN_KEY = "datapulse_token";
const USER_KEY = "datapulse_user";

export interface StoredUser {
  email: string;
  fullName: string;
  role: string;
  phoneNumber?: string; // ✅ Added
  policeStation?: string; // ✅ Added
}

// ============================================
// TOKEN
// ============================================

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const hasToken = (): boolean => {
  return !!getToken();
};

// ============================================
// USER
// ============================================

export const setUser = (user: StoredUser): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getUser = (): StoredUser | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
      try {
        return JSON.parse(user);
      } catch {
        return null;
      }
    }
  }
  return null;
};

export const removeUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
};

// ============================================
// CLEAR ALL
// ============================================

export const clearAuth = (): void => {
  removeToken();
  removeUser();
};
