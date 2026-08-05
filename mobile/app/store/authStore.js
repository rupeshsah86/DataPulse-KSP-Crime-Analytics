import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,

  initializeAuth: async () => {
    try {
      const storedToken = await AsyncStorage.getItem('@datapulse_token');
      const storedUser = await AsyncStorage.getItem('@datapulse_user');

      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: JSON.parse(storedUser),
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (e) {
      console.error('Error initializing mobile auth store', e);
      set({ loading: false });
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      await AsyncStorage.setItem('@datapulse_token', token);
      await AsyncStorage.setItem('@datapulse_user', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
      });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('@datapulse_token');
      await AsyncStorage.removeItem('@datapulse_user');
    } catch (e) {
      console.error('Error during logout', e);
    }
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
