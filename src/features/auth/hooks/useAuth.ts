import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import type { LoginRequest, RegisterRequest, User } from '../types';
import { isSuccessfulAuthResult } from '../types';

/**
 * Decode JWT token to extract user ID
 * Simple JWT decode without verification (verification happens on backend)
 * Supports common JWT claim names for user ID
 */
function decodeJwtUserId(token: string): string | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const decoded = JSON.parse(atob(payload));
    // Check common claim names for user ID
    return decoded.sub || decoded.userId || decoded.nameid || decoded.id || null;
  } catch (error) {
    return null;
  }
}

/**
 * Hook for handling user login
 * @returns React Query mutation for login operation
 */
export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response, variables) => {
      // Use type guard to check if response is successful
      if (!isSuccessfulAuthResult(response)) {
        throw new Error(response.message || 'Login failed');
      }

      // Extract userId from JWT token
      const userId = decodeJwtUserId(response.token);
      if (!userId) {
        throw new Error('Invalid authentication token. Please contact support.');
      }

      // Create user object
      const user: User = {
        id: userId,
        email: variables.email,
        firstName: '',
        lastName: '',
      };

      setAuth(user, response.token);
      navigate('/dashboard');
    },
  });
}

/**
 * Hook for handling user registration
 * @returns React Query mutation for registration operation
 */
export function useRegister() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (response, variables) => {
      // Use type guard to check if response is successful
      if (!isSuccessfulAuthResult(response)) {
        throw new Error(response.message || 'Registration failed');
      }

      // Extract userId from JWT token
      const userId = decodeJwtUserId(response.token);
      if (!userId) {
        throw new Error('Invalid authentication token. Please try logging in.');
      }

      // Create user object with data from registration form
      const user: User = {
        id: userId,
        email: variables.email,
        firstName: variables.firstName,
        lastName: variables.lastName,
      };

      setAuth(user, response.token);
      navigate('/dashboard');
    },
  });
}

/**
 * Hook for handling user logout
 * @returns Logout function that clears auth state and redirects to login
 */
export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return () => {
    logout();
    navigate('/login');
  };
}

/**
 * Hook for accessing auth state
 * @returns Current authentication state from the store
 */
export function useAuth() {
  return useAuthStore();
}
