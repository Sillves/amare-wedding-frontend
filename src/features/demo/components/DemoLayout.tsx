import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { FontSizeSwitcher } from '@/shared/components/FontSizeSwitcher';
import { DemoBanner } from './DemoBanner';

interface DemoLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/demo', labelKey: 'common:dashboard.title' },
  { path: '/demo/guests', labelKey: 'guests:title' },
  { path: '/demo/events', labelKey: 'events:title' },
  { path: '/demo/expenses', labelKey: 'expenses:title' },
  { path: '/demo/website', labelKey: 'website:title' },
  { path: '/demo/rsvp', label: 'RSVP' },
];

export function DemoLayout({ children }: DemoLayoutProps) {
  const { t } = useTranslation(['common', 'guests', 'events', 'expenses', 'website', 'demo']);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/demo') {
      return location.pathname === '/demo';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-muted/40 overflow-x-hidden">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="text-xl font-script text-primary">{t('common:appName')}</span>
            <Badge variant="secondary" className="ml-2">
              Demo
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden sm:flex items-center gap-1 sm:gap-2">
              <FontSizeSwitcher />
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
            <Button variant="outline" size="sm" className="px-2 sm:px-4" onClick={() => navigate('/')}>
              {t('demo:exitDemo')}
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
                {item.label || t(item.labelKey!)}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4 space-y-6">
        {/* Demo Banner */}
        <DemoBanner />

        {children}
      </main>
    </div>
  );
}
