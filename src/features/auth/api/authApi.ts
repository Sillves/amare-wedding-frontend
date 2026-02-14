import { apiClient } from '@/lib/axios';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResult,
  UserProfileDto,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest
} from '../types';

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
    const referralCode = localStorage.getItem('referralCode');
    const url = referralCode ? `/auth/register?ref=${encodeURIComponent(referralCode)}` : '/auth/register';
    const response = await apiClient.post<AuthResult>(url, data);
    if (referralCode) localStorage.removeItem('referralCode');
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

  /**
   * Request password reset email
   * @param data - Email and optional language
   * @returns Promise<void>
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/forgot-password', data);
  },

  /**
   * Reset password with token from email
   * @param data - Email, token, and new password
   * @returns Promise<void>
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/reset-password', data);
  },

  /**
   * Change password for logged-in user
   * @param data - Current and new password
   * @returns Promise<void>
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post('/auth/change-password', data);
  },
} as const;
