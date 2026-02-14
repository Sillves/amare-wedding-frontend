// Types will be replaced with components['schemas'][...] after running npm run sync-types

export interface ReferralStatsDto {
  referralCode: string;
  signedUpCount: number;
  subscribedCount: number;
  conversionRate: number;
  totalCommissionEarned: number;
  pendingPayout: number;
}

export interface ReferralDto {
  id: string;
  referredUserName: string | null;
  registeredAt: string | null;
  convertedAt: string | null;
  commissionPercentage: number;
  commissionStatus: number;
  createdAt: string;
}
