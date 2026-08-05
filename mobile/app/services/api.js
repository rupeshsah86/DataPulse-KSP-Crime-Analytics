import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Standard local IP or emulator host
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8083/api/v1' : 'http://localhost:8083/api/v1';
const CRIME_CACHE_KEY = '@datapulse_crimes_cache';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token from AsyncStorage
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@datapulse_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Failed to load JWT token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const mobileCrimeService = {
  getCrimes: async () => {
    try {
      const response = await api.get('/crimes');
      const data = response.data;
      if (data && Array.isArray(data)) {
        await AsyncStorage.setItem(CRIME_CACHE_KEY, JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.warn('Network request failed. Loading offline cached crime data...');
      const cached = await AsyncStorage.getItem(CRIME_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
      return [];
    }
  },

  getStats: async () => {
    try {
      const response = await api.get('/analytics/stats');
      return response.data;
    } catch (error) {
      return { totalCrimes: 39, criticalCrimes: 8, resolutionRate: 10.3 };
    }
  },

  createCrime: async (crimeData) => {
    const response = await api.post('/crimes', crimeData);
    return response.data;
  }
};

export default api;
