import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';

/**
 * Base URL for the API
 * Defaults to production URL if VITE_API_URL is not set
 */
const API_BASE_URL: string = import.meta.env.VITE_API_URL || 'https://amare.wedding/api';

/**
 * Axios client instance configured for the Wedding Manager API
 * - Includes automatic token injection
 * - Handles 401 responses with automatic logout
 * - 10 second timeout for requests
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Request interceptor
 * Adds Bearer token to all authenticated requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[Auth] Token added to request:', config.url);
    } else if (!token) {
      console.warn('[Auth] No token available for request:', config.url);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handles authentication errors by logging out the user
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log('[Auth] 401 Unauthorized - logging out user');
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
