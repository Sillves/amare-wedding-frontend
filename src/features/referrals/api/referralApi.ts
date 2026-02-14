import { apiClient } from '@/lib/axios';
import type { ReferralStatsDto, ReferralDto } from '../types';

/**
 * Referral program API endpoints
 */
export const referralApi = {
  /**
   * Get or create the current user's referral code
   * @returns Promise<string> - The referral code
   */
  getCode: async (): Promise<string> => {
    const response = await apiClient.get<{ code: string }>('/referrals/code');
    return response.data.code;
  },

  /**
   * Get referral statistics for the current user
   * @returns Promise<ReferralStatsDto> - Aggregated referral stats
   */
  getStats: async (): Promise<ReferralStatsDto> => {
    const response = await apiClient.get<ReferralStatsDto>('/referrals/stats');
    return response.data;
  },

  /**
   * Get list of referrals for the current user
   * @returns Promise<ReferralDto[]> - List of referral records
   */
  getReferrals: async (): Promise<ReferralDto[]> => {
    const response = await apiClient.get<ReferralDto[]>('/referrals');
    return response.data;
  },
} as const;
