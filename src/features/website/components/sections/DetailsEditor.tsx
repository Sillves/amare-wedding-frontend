import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Church, PartyPopper, ExternalLink, Calendar, Database, FileText, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { DetailsContent, VenueDetails, EventsContent, EventCustomization, EventIconType, CustomVenueDetail } from '../../types';

const EVENT_ICONS: { value: EventIconType; labelKey: string }[] = [
  { value: 'church', labelKey: 'eventIcons.church' },
  { value: 'reception', labelKey: 'eventIcons.reception' },
  { value: 'dinner', labelKey: 'eventIcons.dinner' },
  { value: 'party', labelKey: 'eventIcons.party' },
  { value: 'rings', labelKey: 'eventIcons.rings' },
  { value: 'cake', labelKey: 'eventIcons.cake' },
  { value: 'music', labelKey: 'eventIcons.music' },
  { value: 'car', labelKey: 'eventIcons.car' },
];

interface EventDto {
  id: string;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  description?: string;
}

interface DetailsEditorProps {
  data: DetailsContent;
  eventsData: EventsContent;
  eventCustomizations: EventCustomization[];
  weddingEvents?: EventDto[];
  onChange: (data: DetailsContent) => void;
  onEventsChange: (data: EventsContent) => void;
  onCustomizationsChange: (customizations: EventCustomization[]) => void;
}

interface VenueEditorProps {
  type: 'ceremony' | 'reception';
  data: VenueDetails;
  onChange: (data: VenueDetails) => void;
  onDelete?: () => void;
}

function VenueEditor({ type, data, onChange, onDelete }: VenueEditorProps) {
  const { t } = useTranslation('website');
  const [isOpen, setIsOpen] = useState(false);
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
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`rounded-lg border ${data.enabled ? 'bg-card' : 'bg-muted/30'} transition-colors`}>
        <div className="flex items-center justify-between p-4">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-3 flex-1 text-left">
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${iconBg}`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{t(`details.${type}.title`)}</h4>
                <p className="text-xs text-muted-foreground">{t(`details.${type}.description`)}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <div className="flex items-center gap-2 ml-3">
            <Switch
              checked={data.enabled}
              onCheckedChange={(enabled) => handleChange('enabled', enabled)}
            />
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <CollapsibleContent>
          {data.enabled && (
            <div className="p-4 pt-0 space-y-4 border-t">
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
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
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface CustomVenueEditorProps {
  data: CustomVenueDetail;
  onChange: (data: CustomVenueDetail) => void;
  onDelete: () => void;
}

function CustomVenueEditor({ data, onChange, onDelete }: CustomVenueEditorProps) {
  const { t } = useTranslation('website');
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = <K extends keyof CustomVenueDetail>(
    field: K,
    value: CustomVenueDetail[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`rounded-lg border ${data.enabled ? 'bg-card' : 'bg-muted/30'} transition-colors`}>
        <div className="flex items-center justify-between p-4">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-3 flex-1 text-left">
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${data.enabled ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-muted'}`}>
                <MapPin className={`h-4 w-4 ${data.enabled ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium ${!data.enabled && 'text-muted-foreground'}`}>
                  {data.title || t('details.customVenue.newTitle')}
                </h4>
                <p className="text-xs text-muted-foreground">{t('details.customVenue.subtitle')}</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <div className="flex items-center gap-2 ml-3">
            <Switch
              checked={data.enabled}
              onCheckedChange={(enabled) => handleChange('enabled', enabled)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CollapsibleContent>
          {data.enabled && (
            <div className="p-4 pt-0 space-y-4 border-t">
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm">{t('details.venueTitle')}</Label>
                  <Input
                    value={data.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder={t('details.customVenue.titlePlaceholder')}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">{t('eventCustomization.icon')}</Label>
                  <Select
                    value={data.iconType}
                    onValueChange={(value) => handleChange('iconType', value as EventIconType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_ICONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {t(icon.labelKey)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">{t('details.venue')}</Label>
                <Input
                  value={data.venue}
                  onChange={(e) => handleChange('venue', e.target.value)}
                  placeholder={t('details.venuePlaceholder')}
                />
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
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

interface EventCustomizationCardProps {
  event: EventDto;
  customization?: EventCustomization;
  onChange: (customization: EventCustomization) => void;
}

function EventCustomizationCard({ event, customization, onChange }: EventCustomizationCardProps) {
  const { t } = useTranslation('website');
  const [isOpen, setIsOpen] = useState(false);

  const isEnabled = customization?.enabled ?? true;

  const handleChange = (field: keyof EventCustomization, value: string | boolean) => {
    onChange({
      eventId: event.id,
      enabled: customization?.enabled ?? true,
      iconType: customization?.iconType || 'church',
      mapUrl: customization?.mapUrl,
      websiteDescription: customization?.websiteDescription,
      [field]: value,
    });
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className={`rounded-lg border transition-colors ${isEnabled ? 'bg-card' : 'bg-muted/30'}`}>
        <div className="flex items-center justify-between p-4">
          <CollapsibleTrigger asChild>
            <button className="flex items-center gap-3 flex-1 text-left">
              <div className={`flex h-8 w-8 items-center justify-center rounded-md ${isEnabled ? 'bg-primary/10' : 'bg-muted'}`}>
                <Calendar className={`h-4 w-4 ${isEnabled ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium truncate ${!isEnabled && 'text-muted-foreground'}`}>{event.name}</h4>
                <p className="text-xs text-muted-foreground truncate">
                  {event.location} • {new Date(event.startDate).toLocaleDateString()}
                  {event.endDate && event.endDate !== event.startDate && ` - ${new Date(event.endDate).toLocaleDateString()}`}
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
          </CollapsibleTrigger>
          <div className="ml-3">
            <Switch
              checked={isEnabled}
              onCheckedChange={(enabled) => handleChange('enabled', enabled)}
            />
          </div>
        </div>

        <CollapsibleContent>
          {isEnabled && (
            <div className="p-4 pt-0 space-y-4 border-t">
              <div className="grid sm:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-sm">{t('eventCustomization.icon')}</Label>
                  <Select
                    value={customization?.iconType || 'church'}
                    onValueChange={(value) => handleChange('iconType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_ICONS.map((icon) => (
                        <SelectItem key={icon.value} value={icon.value}>
                          {t(icon.labelKey)}
                        </SelectItem>
                      ))}
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
                    value={customization?.mapUrl || ''}
                    onChange={(e) => handleChange('mapUrl', e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">{t('eventCustomization.description')}</Label>
                <Textarea
                  value={customization?.websiteDescription || ''}
                  onChange={(e) => handleChange('websiteDescription', e.target.value)}
                  placeholder={t('eventCustomization.descriptionPlaceholder')}
                  rows={2}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">{t('eventCustomization.descriptionHint')}</p>
              </div>
            </div>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

export function DetailsEditor({
  data,
  eventsData,
  eventCustomizations,
  weddingEvents,
  onChange,
  onEventsChange,
  onCustomizationsChange,
}: DetailsEditorProps) {
  const { t } = useTranslation('website');

  const hasWeddingEvents = weddingEvents && weddingEvents.length > 0;
  const useWeddingEvents = eventsData.enabled && eventsData.showFromWeddingEvents && hasWeddingEvents;

  const handleToggleEnabled = (enabled: boolean) => {
    onChange({ ...data, enabled });
    // Also sync events enabled state
    onEventsChange({ ...eventsData, enabled });
  };

  const handleTitleChange = (title: string) => {
    onChange({ ...data, title });
    // Also update events title to keep them in sync
    onEventsChange({ ...eventsData, title });
  };

  const handleSourceChange = (source: 'wedding' | 'static') => {
    if (source === 'wedding') {
      onEventsChange({ ...eventsData, enabled: true, showFromWeddingEvents: true });
    } else {
      onEventsChange({ ...eventsData, enabled: false, showFromWeddingEvents: false });
    }
  };

  const handleCeremonyChange = (ceremony: VenueDetails) => {
    onChange({ ...data, ceremony });
  };

  const handleReceptionChange = (reception: VenueDetails) => {
    onChange({ ...data, reception });
  };

  const handleDeleteCeremony = () => {
    onChange({
      ...data,
      ceremony: {
        enabled: false,
        title: '',
        venue: '',
        address: '',
        date: '',
        description: '',
        mapUrl: '',
      },
    });
  };

  const handleDeleteReception = () => {
    onChange({
      ...data,
      reception: {
        enabled: false,
        title: '',
        venue: '',
        address: '',
        date: '',
        description: '',
        mapUrl: '',
      },
    });
  };

  const handleCustomVenueChange = (index: number, customVenue: CustomVenueDetail) => {
    const customVenues = [...(data.customVenues || [])];
    customVenues[index] = customVenue;
    onChange({ ...data, customVenues });
  };

  const handleAddCustomVenue = () => {
    const newVenue: CustomVenueDetail = {
      id: `custom-${Date.now()}`,
      enabled: true,
      iconType: 'party',
      title: '',
      venue: '',
      address: '',
      date: '',
      description: '',
      mapUrl: '',
    };
    onChange({ ...data, customVenues: [...(data.customVenues || []), newVenue] });
  };

  const handleDeleteCustomVenue = (index: number) => {
    const customVenues = [...(data.customVenues || [])];
    customVenues.splice(index, 1);
    onChange({ ...data, customVenues });
  };

  const handleEventCustomizationChange = (customization: EventCustomization) => {
    const existing = eventCustomizations.findIndex((c) => c.eventId === customization.eventId);
    if (existing >= 0) {
      const updated = [...eventCustomizations];
      updated[existing] = customization;
      onCustomizationsChange(updated);
    } else {
      onCustomizationsChange([...eventCustomizations, customization]);
    }
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
        <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Section Title */}
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

          {/* Source Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('details.sourceLabel')}</Label>
            <RadioGroup
              value={useWeddingEvents ? 'wedding' : 'static'}
              onValueChange={(v) => handleSourceChange(v as 'wedding' | 'static')}
              className="grid gap-3"
            >
              <label
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  useWeddingEvents
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50'
                } ${!hasWeddingEvents ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RadioGroupItem value="wedding" disabled={!hasWeddingEvents} />
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-100 dark:bg-green-900/30">
                  <Database className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t('details.sourceWedding')}</p>
                  <p className="text-xs text-muted-foreground">
                    {hasWeddingEvents
                      ? t('details.sourceWeddingDescription', { count: weddingEvents?.length })
                      : t('details.sourceWeddingEmpty')}
                  </p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                  !useWeddingEvents
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-muted-foreground/50'
                }`}
              >
                <RadioGroupItem value="static" />
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-100 dark:bg-orange-900/30">
                  <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t('details.sourceStatic')}</p>
                  <p className="text-xs text-muted-foreground">{t('details.sourceStaticDescription')}</p>
                </div>
              </label>
            </RadioGroup>
          </div>

          {/* Content based on source selection */}
          {useWeddingEvents ? (
            /* Wedding Events with Customization */
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{t('details.eventsFromWedding')}</span>
              </div>
              {weddingEvents?.map((event) => (
                <EventCustomizationCard
                  key={event.id}
                  event={event}
                  customization={eventCustomizations.find((c) => c.eventId === event.id)}
                  onChange={handleEventCustomizationChange}
                />
              ))}
            </div>
          ) : (
            /* Static Venue Details */
            <div className="space-y-4">
              <VenueEditor
                type="ceremony"
                data={data.ceremony}
                onChange={handleCeremonyChange}
                onDelete={handleDeleteCeremony}
              />
              <VenueEditor
                type="reception"
                data={data.reception}
                onChange={handleReceptionChange}
                onDelete={handleDeleteReception}
              />

              {/* Custom Venues */}
              {data.customVenues?.map((customVenue, index) => (
                <CustomVenueEditor
                  key={customVenue.id}
                  data={customVenue}
                  onChange={(updated) => handleCustomVenueChange(index, updated)}
                  onDelete={() => handleDeleteCustomVenue(index)}
                />
              ))}

              {/* Add Other Detail Button */}
              <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={handleAddCustomVenue}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('details.customVenue.add')}
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
