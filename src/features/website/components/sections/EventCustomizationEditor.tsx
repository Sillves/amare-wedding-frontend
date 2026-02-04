import { useTranslation } from 'react-i18next';
import { Church, Wine, Utensils, PartyPopper, CircleDot, Cake, Music, Car, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { EventCustomization, EventIconType } from '../../types';
import type { EventDto } from '@/features/weddings/types';

interface EventCustomizationEditorProps {
  events: EventDto[];
  customizations: EventCustomization[];
  onChange: (customizations: EventCustomization[]) => void;
}

// Icon options with their display names and lucide icons
const iconOptions: { value: EventIconType; labelKey: string; icon: React.FC<{ className?: string }> }[] = [
  { value: 'church', labelKey: 'eventIcons.church', icon: Church },
  { value: 'reception', labelKey: 'eventIcons.reception', icon: Wine },
  { value: 'dinner', labelKey: 'eventIcons.dinner', icon: Utensils },
  { value: 'party', labelKey: 'eventIcons.party', icon: PartyPopper },
  { value: 'rings', labelKey: 'eventIcons.rings', icon: CircleDot },
  { value: 'cake', labelKey: 'eventIcons.cake', icon: Cake },
  { value: 'music', labelKey: 'eventIcons.music', icon: Music },
  { value: 'car', labelKey: 'eventIcons.car', icon: Car },
];

export function EventCustomizationEditor({
  events,
  customizations,
  onChange,
}: EventCustomizationEditorProps) {
  const { t } = useTranslation('website');

  // Get customization for a specific event, or return defaults
  const getCustomization = (eventId: string): EventCustomization => {
    const existing = customizations.find((c) => c.eventId === eventId);
    return existing || { eventId, iconType: 'church', mapUrl: '', websiteDescription: '' };
  };

  // Update customization for a specific event
  const updateCustomization = (eventId: string, updates: Partial<EventCustomization>) => {
    const existing = customizations.find((c) => c.eventId === eventId);
    if (existing) {
      onChange(
        customizations.map((c) =>
          c.eventId === eventId ? { ...c, ...updates } : c
        )
      );
    } else {
      // Create new customization
      onChange([
        ...customizations,
        { eventId, iconType: 'church', ...updates } as EventCustomization,
      ]);
    }
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('eventCustomization.title')}</CardTitle>
          <CardDescription>{t('eventCustomization.noEvents')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('eventCustomization.title')}</CardTitle>
        <CardDescription>{t('eventCustomization.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {events.map((event) => {
          const customization = getCustomization(event.id);
          const SelectedIcon = iconOptions.find((i) => i.value === customization.iconType)?.icon || Church;

          return (
            <div key={event.id} className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <SelectedIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{event.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {event.location && `${event.location} - `}
                    {event.startDate && new Date(event.startDate).toLocaleDateString()}
                    {event.endDate && event.endDate !== event.startDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">{t('eventCustomization.iconType')}</Label>
                  <Select
                    value={customization.iconType}
                    onValueChange={(value: EventIconType) =>
                      updateCustomization(event.id, { iconType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{t(option.labelKey)}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm flex items-center gap-1">
                    {t('eventCustomization.mapUrl')}
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </Label>
                  <Input
                    type="url"
                    value={customization.mapUrl || ''}
                    onChange={(e) =>
                      updateCustomization(event.id, { mapUrl: e.target.value })
                    }
                    placeholder="https://maps.google.com/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('eventCustomization.mapUrlHint')}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">{t('eventCustomization.description')}</Label>
                  <Textarea
                    value={customization.websiteDescription || ''}
                    onChange={(e) =>
                      updateCustomization(event.id, { websiteDescription: e.target.value })
                    }
                    placeholder={t('eventCustomization.descriptionPlaceholder')}
                    rows={2}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t('eventCustomization.descriptionHint')}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
