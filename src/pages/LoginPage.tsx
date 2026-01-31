import { LoginForm } from '@/features/auth/components/LoginForm';
import { SEO } from '@/shared/components/seo';

export function LoginPage() {
  return (
    <>
      <SEO page="login" />
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <LoginForm />
      </div>
    </>
  );
}
