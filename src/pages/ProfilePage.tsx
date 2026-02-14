import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, CreditCard, Crown, ArrowRight, Settings, Loader2, Lock, Eye, EyeOff, CheckCircle, Globe, Clock, Share2 } from 'lucide-react';
import { useAuth, useCurrentUser, useChangePassword } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';
import { SubscriptionTierLabel, usePortalSession } from '@/features/billing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useErrorToast } from '@/hooks/useErrorToast';
import { useDateFormat, type TimeFormatPreference } from '@/hooks/useDateFormat';
import { ReferralDashboard } from '@/features/referrals/components/ReferralDashboard';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

const TIME_FORMAT_OPTIONS: { value: TimeFormatPreference; label: string; example: string }[] = [
  { value: '24h', label: '24-hour', example: '14:30' },
  { value: '12h', label: '12-hour', example: '2:30 PM' },
];

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'profile:changePassword.currentPasswordRequired'),
  newPassword: z.string().min(8, 'auth:validation.passwordMinLength'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'auth:validation.passwordsMustMatch',
  path: ['confirmPassword'],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function ProfilePage() {
  const { t, i18n } = useTranslation(['profile', 'common', 'billing', 'auth', 'referrals']);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isLoading } = useCurrentUser();
  const { openPortal, isLoading: isPortalLoading } = usePortalSession();
  const changePasswordMutation = useChangePassword();
  const { showError, showSuccess } = useErrorToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const { timeFormat, setTimeFormat } = useDateFormat();
  const { data: weddings } = useWeddings();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('i18nextLng', languageCode);
  };

  const subscriptionTier = user?.subscriptionTier ?? 0;
  const tierName = SubscriptionTierLabel[subscriptionTier] || 'Free';
  const isPaidPlan = subscriptionTier > 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onChangePassword = (data: ChangePasswordFormData) => {
    changePasswordMutation.mutate(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          showSuccess(t('profile:changePassword.success'));
          reset();
          setPasswordChanged(true);
          setTimeout(() => setPasswordChanged(false), 3000);
        },
        onError: (error) => {
          showError(error);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            {t('common:appName')}
          </h1>
          <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
            {t('profile:backToDashboard')}
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 max-w-2xl space-y-6">
        <div>
          <h2 className="text-3xl font-bold">{t('profile:title')}</h2>
          <p className="text-muted-foreground">{t('profile:subtitle')}</p>
        </div>

        {/* Account Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('profile:accountInfo.title')}
            </CardTitle>
            <CardDescription>{t('profile:accountInfo.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-64" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user?.email}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              {t('profile:changePassword.title')}
            </CardTitle>
            <CardDescription>{t('profile:changePassword.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {passwordChanged ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>{t('profile:changePassword.success')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onChangePassword)} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPassword" className="text-sm font-medium">
                    {t('profile:changePassword.currentPassword')}
                  </label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...register('currentPassword')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-sm text-destructive">{t(errors.currentPassword.message!)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-sm font-medium">
                    {t('profile:changePassword.newPassword')}
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      {...register('newPassword')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">{t(errors.newPassword.message!)}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    {t('profile:changePassword.confirmPassword')}
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{t(errors.confirmPassword.message!)}</p>
                  )}
                </div>

                <Button type="submit" disabled={changePasswordMutation.isPending}>
                  {changePasswordMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  {t('profile:changePassword.submit')}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('profile:language.title')}
            </CardTitle>
            <CardDescription>{t('profile:language.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Time Format */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {t('profile:timeFormat.title')}
            </CardTitle>
            <CardDescription>{t('profile:timeFormat.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={timeFormat} onValueChange={(value) => setTimeFormat(value as TimeFormatPreference)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <span className="flex items-center gap-2">
                      <span>{t(`profile:timeFormat.${option.value}`)}</span>
                      <span className="text-muted-foreground">({option.example})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {t('profile:subscription.title')}
            </CardTitle>
            <CardDescription>{t('profile:subscription.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {isPaidPlan && <Crown className="h-5 w-5 text-yellow-500" />}
                    <span className="text-xl font-semibold">
                      {t(`billing:plans.${tierName.toLowerCase()}.name`)}
                    </span>
                    <Badge variant={isPaidPlan ? 'default' : 'secondary'}>
                      {isPaidPlan ? t('profile:subscription.active') : t('profile:subscription.free')}
                    </Badge>
                  </div>
                </div>

                {!isPaidPlan && (
                  <p className="text-sm text-muted-foreground">
                    {t('profile:subscription.upgradePrompt')}
                  </p>
                )}

                <div className="flex gap-3 pt-2">
                  {isPaidPlan ? (
                    <Button onClick={() => openPortal()} disabled={isPortalLoading}>
                      {isPortalLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Settings className="mr-2 h-4 w-4" />
                      )}
                      {t('profile:subscription.manage')}
                    </Button>
                  ) : (
                    <Button onClick={() => navigate('/pricing')}>
                      {t('profile:subscription.upgrade')}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        {/* Referral Program - Planner only */}
        {user?.accountType === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                {t('referrals:title')}
              </CardTitle>
              <CardDescription>{t('referrals:subtitle')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ReferralDashboard />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
