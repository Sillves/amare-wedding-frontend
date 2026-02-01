import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  label: string;
  data: VenueDetails;
  onChange: (data: VenueDetails) => void;
}

function VenueEditor({ label, data, onChange }: VenueEditorProps) {
  const { t } = useTranslation('website');

  const handleChange = <K extends keyof VenueDetails>(
    field: K,
    value: VenueDetails[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{label}</h4>
        <div className="flex items-center gap-2">
          <Label htmlFor={`${label}-enabled`} className="text-sm font-normal">
            {t('details.show')}
          </Label>
          <Switch
            id={`${label}-enabled`}
            checked={data.enabled}
            onCheckedChange={(enabled) => handleChange('enabled', enabled)}
          />
        </div>
      </div>

      {data.enabled && (
        <div className="space-y-3">
          <div className="grid gap-2">
            <Label>{t('details.venueTitle')}</Label>
            <Input
              value={data.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>{t('details.venue')}</Label>
            <Input
              value={data.venue}
              onChange={(e) => handleChange('venue', e.target.value)}
              placeholder={t('details.venuePlaceholder')}
            />
          </div>

          <div className="grid gap-2">
            <Label>{t('details.address')}</Label>
            <Input
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder={t('details.addressPlaceholder')}
            />
          </div>

          <div className="grid gap-2">
            <Label>{t('details.dateTime')}</Label>
            <DateTimePicker
              value={data.date ? new Date(data.date) : undefined}
              onChange={(date) => handleChange('date', date ? date.toISOString() : '')}
              placeholder={t('details.dateTimePlaceholder')}
            />
          </div>

          <div className="grid gap-2">
            <Label>{t('details.description')}</Label>
            <Textarea
              value={data.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('details.descriptionPlaceholder')}
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label>{t('details.mapUrl')}</Label>
            <Input
              type="url"
              value={data.mapUrl}
              onChange={(e) => handleChange('mapUrl', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('details.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="details-enabled" className="text-sm font-normal">
              {t('details.enabled')}
            </Label>
            <Switch
              id="details-enabled"
              checked={data.enabled}
              onCheckedChange={handleToggleEnabled}
            />
          </div>
        </div>
      </CardHeader>

      {data.enabled && (
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="details-title">{t('details.sectionTitle')}</Label>
            <Input
              id="details-title"
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <VenueEditor
            label={t('details.ceremony.title')}
            data={data.ceremony}
            onChange={handleCeremonyChange}
          />

          <VenueEditor
            label={t('details.reception.title')}
            data={data.reception}
            onChange={handleReceptionChange}
          />
        </CardContent>
      )}
    </Card>
  );
}
