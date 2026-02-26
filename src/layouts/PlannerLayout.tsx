import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { FontSizeSwitcher } from '@/shared/components/FontSizeSwitcher';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { useAuth, useLogout } from '@/features/auth/hooks/useAuth';
import { useWeddings } from '@/features/weddings/hooks/useWeddings';

interface PlannerLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/planner', labelKey: 'common:planner.myWeddings' },
  { path: '/referrals', labelKey: 'referrals:title' },
  { path: '/profile', labelKey: 'common:profile' },
];

export function PlannerLayout({ children }: PlannerLayoutProps) {
  const { t } = useTranslation(['common', 'referrals', 'auth']);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const { user } = useAuth();
  const { data: weddings } = useWeddings();

  const ownedWeddings = weddings?.filter(w => w.role === 0) ?? [];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/planner')}
          >
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-script text-primary">{t('common:appName')}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
              <FontSizeSwitcher />
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
            {ownedWeddings.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                {t('common:planner.myWedding')}
              </Button>
            )}
            <span className="hidden md:inline text-sm text-muted-foreground">
              {user?.firstName}
            </span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">{t('auth:logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                className={`rounded-none border-b-2 transition-colors whitespace-nowrap ${
                  isActive(item.path)
                    ? 'border-primary text-primary'
                    : 'border-transparent hover:border-muted-foreground/30'
                }`}
                onClick={() => navigate(item.path)}
              >
                {t(item.labelKey)}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
