import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { WebsiteContent, WebsiteSettings, WebsiteTemplate, EventDto } from '../types';
import type { EventDto as WeddingEventDto } from '@/features/weddings/types';

// Import templates
import { ElegantClassicTemplate } from '../templates/ElegantClassic/ElegantClassicTemplate';
import { ModernMinimalTemplate } from '../templates/ModernMinimal/ModernMinimalTemplate';
import { RomanticGardenTemplate } from '../templates/RomanticGarden/RomanticGardenTemplate';

interface WebsitePreviewProps {
  template: WebsiteTemplate;
  content: WebsiteContent;
  settings: WebsiteSettings;
  weddingSlug: string;
  events?: WeddingEventDto[];
}

type DeviceSize = 'desktop' | 'tablet' | 'mobile';

const deviceSizes: Record<DeviceSize, { width: string; icon: typeof Monitor }> = {
  desktop: { width: '100%', icon: Monitor },
  tablet: { width: '768px', icon: Tablet },
  mobile: { width: '375px', icon: Smartphone },
};

export function WebsitePreview({
  template,
  content,
  settings,
  weddingSlug,
  events,
}: WebsitePreviewProps) {
  const { t } = useTranslation('website');
  const [device, setDevice] = useState<DeviceSize>('desktop');

  const TemplateComponent = {
    ElegantClassic: ElegantClassicTemplate,
    ModernMinimal: ModernMinimalTemplate,
    RomanticGarden: RomanticGardenTemplate,
  }[template];

  // Convert wedding events to template EventDto format
  const templateEvents: EventDto[] | undefined = events?.map((event) => ({
    id: event.id,
    name: event.name,
    description: event.description,
    location: event.location || '',
    startDate: event.startDate || '',
    endDate: event.endDate || '',
  }));

  return (
    <div className="h-full flex flex-col">
      {/* Device switcher */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <h3 className="font-medium">{t('preview.title')}</h3>
        <div className="flex items-center gap-1">
          {(Object.keys(deviceSizes) as DeviceSize[]).map((size) => {
            const { icon: Icon } = deviceSizes[size];
            return (
              <Button
                key={size}
                variant={device === size ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDevice(size)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>

      {/* Preview container */}
      <div className="flex-1 overflow-auto bg-muted p-4">
        <div
          className={cn(
            'mx-auto bg-white shadow-lg transition-all duration-300',
            device !== 'desktop' && 'rounded-lg border'
          )}
          style={{ maxWidth: deviceSizes[device].width }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <TemplateComponent
              content={content}
              settings={settings}
              weddingSlug={weddingSlug}
              events={templateEvents}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
