import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useResetPassword } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { SEO } from '@/shared/components/seo';

const REDIRECT_DELAY_SECONDS = 5;

const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'auth:validation.passwordMinLength'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'auth:validation.passwordsMustMatch',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
  const { t } = useTranslation(['auth', 'common']);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPasswordMutation = useResetPassword();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(REDIRECT_DELAY_SECONDS);

  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  // Countdown and auto-redirect after successful password reset
  useEffect(() => {
    if (!isSubmitted) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Check if we have required params
  if (!email || !token) {
    return (
      <>
        <SEO page="resetPassword" />
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl">{t('auth:resetPassword.invalidLinkTitle')}</CardTitle>
              <CardDescription>{t('auth:resetPassword.invalidLinkMessage')}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link to="/forgot-password">
                <Button variant="outline">
                  {t('auth:resetPassword.requestNewLink')}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(
      { email, token, newPassword: data.newPassword },
      {
        onSuccess: () => setIsSubmitted(true),
      }
    );
  };

  if (isSubmitted) {
    return (
      <>
        <SEO page="resetPassword" />
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">{t('auth:resetPassword.successTitle')}</CardTitle>
              <CardDescription>{t('auth:resetPassword.successMessage')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth:resetPassword.redirectingIn', { seconds: countdown })}
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Link to="/login">
                <Button>
                  {t('auth:resetPassword.goToLogin')}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO page="resetPassword" />
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t('auth:resetPassword.title')}</CardTitle>
            <CardDescription>{t('auth:resetPassword.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="newPassword" className="text-sm font-medium">
                  {t('auth:resetPassword.newPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    {...register('newPassword')}
                    className="pl-10"
                  />
                </div>
                {errors.newPassword && <p className="text-sm text-destructive">{t(errors.newPassword.message!)}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t('auth:resetPassword.confirmPassword')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...register('confirmPassword')}
                    className="pl-10"
                  />
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive">{t(errors.confirmPassword.message!)}</p>}
              </div>

              {resetPasswordMutation.isError && (
                <p className="text-sm text-destructive">{t('auth:resetPassword.error')}</p>
              )}

              <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? t('common:loading') : t('auth:resetPassword.submit')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-1 inline h-4 w-4" />
              {t('auth:resetPassword.backToLogin')}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
