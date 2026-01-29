import { apiClient } from '@/lib/axios';
import type { LoginRequest, RegisterRequest, AuthResult, UserProfileDto } from '../types';

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

  /**
   * Get current user profile including subscription tier
   * @returns Promise<UserProfileDto> - User profile with subscription info
   * @throws Error if the request fails or user is not authenticated
   */
  getCurrentUser: async (): Promise<UserProfileDto> => {
    const response = await apiClient.get<UserProfileDto>('/auth/me');
    return response.data;
  },
} as const;
