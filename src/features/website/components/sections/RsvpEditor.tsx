import { useTranslation } from 'react-i18next';
import { Mail, CalendarClock, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/ui/date-time-picker';
import type { RsvpContent } from '../../types';

interface RsvpEditorProps {
  data: RsvpContent;
  onChange: (data: RsvpContent) => void;
}

const MAX_DESCRIPTION_LENGTH = 300;

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

  const descriptionLength = data.description?.length || 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <Mail className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <CardTitle>{t('rsvp.title')}</CardTitle>
              <CardDescription>{t('rsvp.subtitle')}</CardDescription>
            </div>
          </div>
          <Switch
            checked={data.enabled}
            onCheckedChange={handleToggleEnabled}
          />
        </div>
      </CardHeader>

      {data.enabled && (
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rsvp-title" className="text-sm font-medium">
              {t('rsvp.sectionTitle')}
            </Label>
            <Input
              id="rsvp-title"
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="rsvp-description" className="text-sm font-medium">
                {t('rsvp.description')}
              </Label>
              <span className={`text-xs ${descriptionLength > MAX_DESCRIPTION_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
                {descriptionLength}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <Textarea
              id="rsvp-description"
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="resize-none"
              placeholder={t('rsvp.descriptionPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              {t('rsvp.deadline')}
            </Label>
            <DatePicker
              value={data.deadline ? new Date(data.deadline) : undefined}
              onChange={(date) => handleChange('deadline', date ? date.toISOString().split('T')[0] : '')}
              placeholder={t('rsvp.deadlinePlaceholder')}
            />
            <p className="text-xs text-muted-foreground">{t('rsvp.deadlineHint')}</p>
          </div>

          <div className="rounded-lg bg-muted/50 border p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-foreground mb-1">{t('rsvp.linkNoteTitle')}</p>
                <p className="text-muted-foreground">
                  {t('rsvp.linkNote')}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
