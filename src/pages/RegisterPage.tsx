import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { SEO } from '@/shared/components/seo';

export function RegisterPage() {
  return (
    <>
      <SEO page="register" />
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <RegisterForm />
      </div>
    </>
  );
}
