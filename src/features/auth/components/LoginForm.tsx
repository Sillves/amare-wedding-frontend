import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLogin } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const loginSchema = z.object({
  email: z.string().email('auth:validation.emailInvalid'),
  password: z.string().min(1, 'auth:validation.passwordRequired'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { t } = useTranslation(['auth', 'common']);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{t('auth:login.title')}</CardTitle>
        <CardDescription>{t('auth:login.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t('auth:login.email')}
            </label>
            <Input id="email" type="email" {...register('email')} placeholder="naam@example.com" />
            {errors.email && <p className="text-sm text-destructive">{t(errors.email.message!)}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                {t('auth:login.password')}
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                {t('auth:login.forgotPassword')}
              </Link>
            </div>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{t(errors.password.message!)}</p>}
          </div>

          {loginMutation.isError && (
            <p className="text-sm text-destructive">{t('auth:login.error')}</p>
          )}

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? t('common:loading') : t('auth:login.submit')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          {t('auth:login.noAccount')}{' '}
          <Link to="/register" className="text-primary hover:underline">
            {t('auth:login.register')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
