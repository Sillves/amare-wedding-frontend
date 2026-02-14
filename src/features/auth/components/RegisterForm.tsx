import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { useRegister } from '../hooks/useAuth';
import { AccountTypeStep } from './AccountTypeStep';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

const registerSchema = z
  .object({
    firstName: z.string().min(1, 'auth:validation.firstNameRequired'),
    lastName: z.string().min(1, 'auth:validation.lastNameRequired'),
    email: z.string().email('auth:validation.emailInvalid'),
    password: z.string().min(8, 'auth:validation.passwordMin'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'auth:validation.passwordsMismatch',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { t } = useTranslation(['auth', 'common']);
  const registerMutation = useRegister();
  const [step, setStep] = useState<'type' | 'details'>('type');
  const [accountType, setAccountType] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleAccountTypeSelect = (type: number) => {
    setAccountType(type);
    setStep('details');
  };

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate({ ...registerData, accountType });
  };

  if (step === 'type') {
    return (
      <div className="flex flex-col items-center space-y-4">
        <AccountTypeStep onSelect={handleAccountTypeSelect} />
        <p className="text-sm text-muted-foreground">
          {t('auth:register.hasAccount')}{' '}
          <Link to="/login" className="text-primary hover:underline">
            {t('auth:register.login')}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <button
          type="button"
          onClick={() => setStep('type')}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('auth:register.accountType.back')}
        </button>
        <CardTitle className="text-2xl">{t('auth:register.title')}</CardTitle>
        <CardDescription>{t('auth:register.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium">
              {t('auth:register.firstName')}
            </label>
            <Input id="firstName" type="text" {...register('firstName')} />
            {errors.firstName && <p className="text-sm text-destructive">{t(errors.firstName.message!)}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium">
              {t('auth:register.lastName')}
            </label>
            <Input id="lastName" type="text" {...register('lastName')} />
            {errors.lastName && <p className="text-sm text-destructive">{t(errors.lastName.message!)}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              {t('auth:register.email')}
            </label>
            <Input id="email" type="email" {...register('email')} placeholder="naam@example.com" />
            {errors.email && <p className="text-sm text-destructive">{t(errors.email.message!)}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              {t('auth:register.password')}
            </label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{t(errors.password.message!)}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              {t('auth:register.confirmPassword')}
            </label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{t(errors.confirmPassword.message!)}</p>
            )}
          </div>

          {registerMutation.isError && (
            <p className="text-sm text-destructive">{t('auth:register.error')}</p>
          )}

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? t('common:loading') : t('auth:register.submit')}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-muted-foreground">
          {t('auth:register.hasAccount')}{' '}
          <Link to="/login" className="text-primary hover:underline">
            {t('auth:register.login')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
