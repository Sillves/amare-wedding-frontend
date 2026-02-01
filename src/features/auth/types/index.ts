import type { components } from '@/types/api';

/**
 * Auto-generated types from OpenAPI spec
 * These are imported from the generated api.ts file
 */

/**
 * Login request payload - Auto-generated from OpenAPI
 * Backend allows nullable fields but we enforce them client-side
 */
export type LoginRequestDto = components['schemas']['LoginRequest'];

/**
 * Login request with required fields enforced
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Registration request payload - Auto-generated from OpenAPI
 * Backend allows nullable fields but we enforce them client-side
 */
export type RegisterRequestDto = components['schemas']['RegisterRequest'];

/**
 * Registration request with required fields enforced
 */
export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

/**
 * Authentication response from the API - Auto-generated from OpenAPI
 * Note: Backend renamed AuthResponse to AuthResult and removed userId
 */
export type AuthResult = components['schemas']['AuthResult'];

/**
 * User profile from /api/auth/me endpoint
 */
export type UserProfileDto = components['schemas']['UserProfileDto'];

/**
 * Subscription tier enum (0=Free, 1=Starter, 2=Pro)
 */
export type SubscriptionTier = components['schemas']['SubscriptionTier'];

/**
 * User data stored in the application
 * Includes subscription tier from profile
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  subscriptionTier?: SubscriptionTier;
}

/**
 * Type guard to check if auth result is successful
 * Narrows the type to ensure token is a string
 * Note: userId is no longer returned by the backend
 */
export function isSuccessfulAuthResult(
  response: AuthResult
): response is AuthResult & { token: string } {
  return Boolean(response.success && response.token);
}

/**
 * Forgot password request payload - Auto-generated from OpenAPI
 * Backend allows nullable fields but we enforce them client-side
 */
export type ForgotPasswordRequestDto = components['schemas']['ForgotPasswordRequest'];

/**
 * Forgot password request with required fields enforced
 */
export interface ForgotPasswordRequest {
  email: string;
  language?: string;
}

/**
 * Reset password request payload - Auto-generated from OpenAPI
 * Backend allows nullable fields but we enforce them client-side
 */
export type ResetPasswordRequestDto = components['schemas']['ResetPasswordRequest'];

/**
 * Reset password request with required fields enforced
 */
export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

/**
 * Change password request payload - Auto-generated from OpenAPI
 * Backend allows nullable fields but we enforce them client-side
 */
export type ChangePasswordRequestDto = components['schemas']['ChangePasswordRequest'];

/**
 * Change password request with required fields enforced (for logged-in users)
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
