import { useTranslation } from 'react-i18next';
import { MapPin, Church, PartyPopper, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import type { DetailsContent, VenueDetails } from '../../types';

interface DetailsEditorProps {
  data: DetailsContent;
  onChange: (data: DetailsContent) => void;
}

interface VenueEditorProps {
  type: 'ceremony' | 'reception';
  data: VenueDetails;
  onChange: (data: VenueDetails) => void;
}

function VenueEditor({ type, data, onChange }: VenueEditorProps) {
  const { t } = useTranslation('website');
  const Icon = type === 'ceremony' ? Church : PartyPopper;
  const iconBg = type === 'ceremony' ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-amber-100 dark:bg-amber-900/30';
  const iconColor = type === 'ceremony' ? 'text-purple-600 dark:text-purple-400' : 'text-amber-600 dark:text-amber-400';

  const handleChange = <K extends keyof VenueDetails>(
    field: K,
    value: VenueDetails[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className={`rounded-lg border ${data.enabled ? 'bg-card' : 'bg-muted/30'} transition-colors`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${iconBg}`}>
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
          <div>
            <h4 className="font-medium">{t(`details.${type}.title`)}</h4>
            <p className="text-xs text-muted-foreground">{t(`details.${type}.description`)}</p>
          </div>
        </div>
        <Switch
          checked={data.enabled}
          onCheckedChange={(enabled) => handleChange('enabled', enabled)}
        />
      </div>

      {data.enabled && (
        <div className="p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">{t('details.venueTitle')}</Label>
              <Input
                value={data.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder={t(`details.${type}.titlePlaceholder`)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">{t('details.venue')}</Label>
              <Input
                value={data.venue}
                onChange={(e) => handleChange('venue', e.target.value)}
                placeholder={t('details.venuePlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">{t('details.address')}</Label>
            <Input
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder={t('details.addressPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">{t('details.dateTime')}</Label>
            <DateTimePicker
              value={data.date ? new Date(data.date) : undefined}
              onChange={(date) => handleChange('date', date ? date.toISOString() : '')}
              placeholder={t('details.dateTimePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">{t('details.description')}</Label>
            <Textarea
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('details.descriptionPlaceholder')}
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm flex items-center gap-1">
              {t('details.mapUrl')}
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </Label>
            <Input
              type="url"
              value={data.mapUrl}
              onChange={(e) => handleChange('mapUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
            <p className="text-xs text-muted-foreground">{t('details.mapUrlHint')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export function DetailsEditor({ data, onChange }: DetailsEditorProps) {
  const { t } = useTranslation('website');

  const handleToggleEnabled = (enabled: boolean) => {
    onChange({ ...data, enabled });
  };

  const handleTitleChange = (title: string) => {
    onChange({ ...data, title });
  };

  const handleCeremonyChange = (ceremony: VenueDetails) => {
    onChange({ ...data, ceremony });
  };

  const handleReceptionChange = (reception: VenueDetails) => {
    onChange({ ...data, reception });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle>{t('details.title')}</CardTitle>
              <CardDescription>{t('details.subtitle')}</CardDescription>
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
            <Label htmlFor="details-title" className="text-sm font-medium">
              {t('details.sectionTitle')}
            </Label>
            <Input
              id="details-title"
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <VenueEditor
            type="ceremony"
            data={data.ceremony}
            onChange={handleCeremonyChange}
          />

          <VenueEditor
            type="reception"
            data={data.reception}
            onChange={handleReceptionChange}
          />
        </CardContent>
      )}
    </Card>
  );
}
