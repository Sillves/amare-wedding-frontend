import { apiClient } from '@/lib/axios';
import type { LoginRequest, RegisterRequest, AuthResult } from '../types';

/**
 * Authentication API endpoints
 * All endpoints follow the OpenAPI specification
 */
export const authApi = {
  /**
   * Login user with email and password
   * @param data - Login credentials
   * @returns Promise<AuthResult> - Authentication result with token
   * @throws Error if the request fails
   */
  login: async (data: LoginRequest): Promise<AuthResult> => {
    const response = await apiClient.post<AuthResult>('/auth/login', data);
    return response.data;
  },

  /**
   * Register a new user
   * @param data - Registration data including email, password, firstName, and lastName
   * @returns Promise<AuthResult> - Authentication result with token
   * @throws Error if the request fails
   */
  register: async (data: RegisterRequest): Promise<AuthResult> => {
    const response = await apiClient.post<AuthResult>('/auth/register', data);
    return response.data;
  },
} as const;
