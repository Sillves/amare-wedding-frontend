import { apiClient } from '@/lib/axios';
import type {
  BillingPlanRequest,
  BillingCheckoutSession,
  BillingPortalSession,
  BillingPlanDto,
  SubscriptionTier,
  BillingInterval,
} from '../types';

/**
 * Billing API endpoints
 * Handles Stripe checkout session creation for one-time payments
 */
export const billingApi = {
  /**
   * Get all available billing plans with pricing
   * @returns Promise<BillingPlanDto[]> - List of plans with features and prices
   */
  getPlans: async (): Promise<BillingPlanDto[]> => {
    const response = await apiClient.get<BillingPlanDto[]>('/billing/plans');
    return response.data;
  },

  /**
   * Create a Stripe Checkout session for one-time purchase
   * @param tier - The subscription tier (Starter=1, Pro=2)
   * @param interval - The billing interval (Lifetime=0 for one-time)
   * @returns Promise<BillingCheckoutSession> - Contains sessionId and redirect URL
   */
  createCheckoutSession: async (
    tier: SubscriptionTier,
    interval: BillingInterval
  ): Promise<BillingCheckoutSession> => {
    const request: BillingPlanRequest = { tier, interval };
    const response = await apiClient.post<BillingCheckoutSession>(
      '/billing/checkout-session',
      request
    );
    return response.data;
  },

  /**
   * Create a Stripe Billing Portal session
   * For existing customers to view their payment history
   * @returns Promise<BillingPortalSession> - Contains sessionId and redirect URL
   */
  createPortalSession: async (): Promise<BillingPortalSession> => {
    const response = await apiClient.post<BillingPortalSession>('/billing/portal-session');
    return response.data;
  },
} as const;
