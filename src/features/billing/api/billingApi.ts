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
 * Handles Stripe checkout session creation and plan changes
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
   * Create a Stripe Checkout session for subscription purchase
   * @param tier - The subscription tier (Starter=1, Pro=2)
   * @param interval - The billing interval (Monthly=0, Annual=1, Lifetime=2)
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
   * Change the current subscription plan
   * For users who already have an active subscription
   * @param tier - The new subscription tier
   * @param interval - The new billing interval
   */
  changePlan: async (
    tier: SubscriptionTier,
    interval: BillingInterval
  ): Promise<void> => {
    const request: BillingPlanRequest = { tier, interval };
    await apiClient.post('/billing/change-plan', request);
  },

  /**
   * Create a Stripe Billing Portal session
   * For existing subscribers to manage their subscription
   * @returns Promise<BillingPortalSession> - Contains sessionId and redirect URL
   */
  createPortalSession: async (): Promise<BillingPortalSession> => {
    const response = await apiClient.post<BillingPortalSession>('/billing/portal-session');
    return response.data;
  },
} as const;
