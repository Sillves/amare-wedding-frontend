import axios from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

// Base URL van uw API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://amare.wedding/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconden timeout
});

// Request interceptor - voegt token toe aan elke request
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handelt errors af
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Als 401 Unauthorized, logout gebruiker
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
