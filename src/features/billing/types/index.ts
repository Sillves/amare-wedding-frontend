import type { components } from '@/types/api';

/**
 * Subscription tier enum values
 * 0 = Free, 1 = Starter, 2 = Pro
 */
export type SubscriptionTier = components['schemas']['SubscriptionTier'];

/**
 * Billing interval enum values
 * 0 = Monthly, 1 = Annual, 2 = Lifetime
 */
export type BillingInterval = components['schemas']['BillingInterval'];

/**
 * Request payload for checkout session and plan change
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
 * Billing interval labels for display
 */
export const BillingIntervalLabel: Record<BillingInterval, string> = {
  0: 'Monthly',
  1: 'Annual',
  2: 'Lifetime',
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

/**
 * Helper to convert string interval to enum value
 */
export function intervalToEnum(interval: 'Monthly' | 'Annual' | 'Lifetime'): BillingInterval {
  const map: Record<string, BillingInterval> = {
    Monthly: 0,
    Annual: 1,
    Lifetime: 2,
  };
  return map[interval];
}
