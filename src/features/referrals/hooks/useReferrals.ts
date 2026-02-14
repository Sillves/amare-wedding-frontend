import { useQuery } from '@tanstack/react-query';
import { referralApi } from '../api/referralApi';

/**
 * Hook for fetching the current user's referral code
 */
export function useReferralCode() {
  const query = useQuery({
    queryKey: ['referrals', 'code'],
    queryFn: () => referralApi.getCode(),
    staleTime: 1000 * 60 * 60, // 1 hour - code rarely changes
  });

  return {
    code: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook for fetching referral statistics
 */
export function useReferralStats() {
  const query = useQuery({
    queryKey: ['referrals', 'stats'],
    queryFn: () => referralApi.getStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    stats: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
}

/**
 * Hook for fetching referral list
 */
export function useReferrals() {
  const query = useQuery({
    queryKey: ['referrals', 'list'],
    queryFn: () => referralApi.getReferrals(),
    staleTime: 1000 * 60 * 5,
  });

  return {
    referrals: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
