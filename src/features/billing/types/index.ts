import type { components } from '@/types/api';

/**
 * Subscription tier enum values
 * 0 = Free, 1 = Starter, 2 = Pro
 */
export type SubscriptionTier = components['schemas']['SubscriptionTier'];

/**
 * Billing interval enum values
 * 0 = Lifetime (one-time payment)
 */
export type BillingInterval = components['schemas']['BillingInterval'];

/**
 * Request payload for checkout session
 */
export type BillingPlanRequest = components['schemas']['BillingPlanRequest'];

/**
 * Response from checkout session creation
 */
export type BillingCheckoutSession = components['schemas']['BillingCheckoutSession'];

/**
 * Response from portal session creation
 */
export interface BillingPortalSession {
  sessionId: string;
  url: string;
}

/**
 * Billing plan with features and pricing from API
 */
export type BillingPlanDto = components['schemas']['BillingPlanDto'];

/**
 * Price information for a billing plan
 */
export type BillingPlanPriceDto = components['schemas']['BillingPlanPriceDto'];

/**
 * Subscription tier labels for display
 */
export const SubscriptionTierLabel: Record<SubscriptionTier, string> = {
  0: 'Free',
  1: 'Starter',
  2: 'Pro',
};

/**
 * Helper to convert tier enum to string
 */
export function tierToString(tier: SubscriptionTier): 'Free' | 'Starter' | 'Pro' {
  const map: Record<SubscriptionTier, 'Free' | 'Starter' | 'Pro'> = {
    0: 'Free',
    1: 'Starter',
    2: 'Pro',
  };
  return map[tier];
}
