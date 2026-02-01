import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { useForgotPassword } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { SEO } from '@/shared/components/seo';

const forgotPasswordSchema = z.object({
  email: z.string().email('auth:validation.emailInvalid'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
  const { t, i18n } = useTranslation(['auth', 'common']);
  const forgotPasswordMutation = useForgotPassword();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(
      { email: data.email, language: i18n.language },
      {
        onSuccess: () => setIsSubmitted(true),
      }
    );
  };

  if (isSubmitted) {
    return (
      <>
        <SEO page="forgotPassword" />
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">{t('auth:forgotPassword.successTitle')}</CardTitle>
              <CardDescription>{t('auth:forgotPassword.successMessage')}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Link to="/login">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('auth:forgotPassword.backToLogin')}
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
      <SEO page="forgotPassword" />
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">{t('auth:forgotPassword.title')}</CardTitle>
            <CardDescription>{t('auth:forgotPassword.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t('auth:forgotPassword.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="name@example.com"
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{t(errors.email.message!)}</p>}
              </div>

              {forgotPasswordMutation.isError && (
                <p className="text-sm text-destructive">{t('auth:forgotPassword.error')}</p>
              )}

              <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
                {forgotPasswordMutation.isPending ? t('common:loading') : t('auth:forgotPassword.submit')}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="mr-1 inline h-4 w-4" />
              {t('auth:forgotPassword.backToLogin')}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
