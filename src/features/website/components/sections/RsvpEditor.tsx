import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { RsvpContent } from '../../types';

interface RsvpEditorProps {
  data: RsvpContent;
  onChange: (data: RsvpContent) => void;
}

export function RsvpEditor({ data, onChange }: RsvpEditorProps) {
  const { t } = useTranslation('website');

  const handleToggleEnabled = (enabled: boolean) => {
    onChange({ ...data, enabled });
  };

  const handleChange = <K extends keyof RsvpContent>(
    field: K,
    value: RsvpContent[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('rsvp.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="rsvp-enabled" className="text-sm font-normal">
              {t('rsvp.enabled')}
            </Label>
            <Switch
              id="rsvp-enabled"
              checked={data.enabled}
              onCheckedChange={handleToggleEnabled}
            />
          </div>
        </div>
      </CardHeader>

      {data.enabled && (
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="rsvp-title">{t('rsvp.sectionTitle')}</Label>
            <Input
              id="rsvp-title"
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rsvp-description">{t('rsvp.description')}</Label>
            <Textarea
              id="rsvp-description"
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="rsvp-deadline">{t('rsvp.deadline')}</Label>
            <Input
              id="rsvp-deadline"
              type="date"
              value={data.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t('rsvp.linkNote')}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
