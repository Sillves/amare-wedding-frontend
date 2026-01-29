import { useMutation, useQuery } from '@tanstack/react-query';
import { billingApi } from '../api/billingApi';
import type { SubscriptionTier, BillingInterval } from '../types';

interface CheckoutParams {
  tier: SubscriptionTier;
  interval: BillingInterval;
}

/**
 * Hook for fetching available billing plans
 * Usage: const { plans, isLoading } = usePlans();
 */
export function usePlans() {
  const query = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => billingApi.getPlans(),
    staleTime: 1000 * 60 * 30, // 30 minutes - plans don't change often
  });

  return {
    plans: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    isError: query.isError,
  };
}

/**
 * Hook for creating a Stripe Checkout session and redirecting to payment
 * Usage: const { startCheckout, isLoading } = useCheckout();
 */
export function useCheckout() {
  const mutation = useMutation({
    mutationFn: async ({ tier, interval }: CheckoutParams) => {
      const session = await billingApi.createCheckoutSession(tier, interval);
      return session;
    },
    onSuccess: (session) => {
      // Redirect to Stripe Checkout
      if (session.url) {
        window.location.href = session.url;
      }
    },
  });

  return {
    startCheckout: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}

/**
 * Hook for changing an existing subscription plan
 * Usage: const { changePlan, isLoading } = useChangePlan();
 */
export function useChangePlan() {
  const mutation = useMutation({
    mutationFn: async ({ tier, interval }: CheckoutParams) => {
      await billingApi.changePlan(tier, interval);
    },
  });

  return {
    changePlan: mutation.mutate,
    changePlanAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

/**
 * Hook for opening Stripe Billing Portal
 * For existing subscribers to manage their subscription (upgrade, downgrade, cancel)
 * Usage: const { openPortal, isLoading } = usePortalSession();
 */
export function usePortalSession() {
  const mutation = useMutation({
    mutationFn: async () => {
      const session = await billingApi.createPortalSession();
      return session;
    },
    onSuccess: (session) => {
      // Redirect to Stripe Billing Portal
      if (session.url) {
        window.location.href = session.url;
      }
    },
  });

  return {
    openPortal: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
  };
}
