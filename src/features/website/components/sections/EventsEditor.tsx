import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { EventsContent } from '../../types';

interface EventsEditorProps {
  data: EventsContent;
  onChange: (data: EventsContent) => void;
}

export function EventsEditor({ data, onChange }: EventsEditorProps) {
  const { t } = useTranslation('website');

  const handleToggleEnabled = (enabled: boolean) => {
    onChange({ ...data, enabled });
  };

  const handleTitleChange = (title: string) => {
    onChange({ ...data, title });
  };

  const handleShowEventsChange = (showFromWeddingEvents: boolean) => {
    onChange({ ...data, showFromWeddingEvents });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('events.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="events-enabled" className="text-sm font-normal">
              {t('events.enabled')}
            </Label>
            <Switch
              id="events-enabled"
              checked={data.enabled}
              onCheckedChange={handleToggleEnabled}
            />
          </div>
        </div>
      </CardHeader>

      {data.enabled && (
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="events-title">{t('events.sectionTitle')}</Label>
            <Input
              id="events-title"
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <Label htmlFor="show-wedding-events" className="font-medium">
                {t('events.showFromWedding')}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t('events.showFromWeddingDescription')}
              </p>
            </div>
            <Switch
              id="show-wedding-events"
              checked={data.showFromWeddingEvents}
              onCheckedChange={handleShowEventsChange}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
