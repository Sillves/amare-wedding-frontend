import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EventCard } from '@/features/events/components/EventCard';
import { DemoProvider } from '@/features/demo/context/DemoContext';
import { DemoBanner } from '@/features/demo/components/DemoBanner';
import { DEMO_EVENTS } from '@/features/demo/data/mockEvents';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher';

function DemoEventsContent() {
  const { t } = useTranslation(['events', 'common', 'demo']);
  const navigate = useNavigate();

  const events = DEMO_EVENTS;

  // Sort events by start date
  const sortedEvents = [...events].sort((a, b) => {
    if (!a.startDate || !b.startDate) return 0;
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  const handleDemoAction = () => {
    // Demo mode - actions are disabled
  };

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/demo')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">{t('common:appName')}</span>
              <Badge variant="secondary" className="ml-2">
                Demo
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              {t('demo:exitDemo')}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6">
        {/* Demo Banner */}
        <DemoBanner />

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">{t('events:title')}</h2>
            <p className="text-muted-foreground">{t('events:manageDescription')}</p>
          </div>
          <Button disabled>
            <Calendar className="h-4 w-4 mr-2" />
            {t('events:addEvent')}
          </Button>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('events:eventList')}</CardTitle>
            <CardDescription>
              {t('events:eventListDescription', { wedding: 'Emma & James' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {sortedEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  guestCount={0}
                  onEdit={handleDemoAction}
                  onDelete={handleDemoAction}
                  onManageGuests={handleDemoAction}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export function DemoEventsPage() {
  return (
    <DemoProvider>
      <DemoEventsContent />
    </DemoProvider>
  );
}
