import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { WebsiteTemplate } from '../types';
import { TEMPLATE_INFO } from '../utils/defaultContent';

interface TemplatePickerProps {
  selected: WebsiteTemplate;
  onSelect: (template: WebsiteTemplate) => void;
}

const templates: WebsiteTemplate[] = ['ElegantClassic', 'ModernMinimal', 'RomanticGarden'];

const templateColors: Record<WebsiteTemplate, { bg: string; accent: string }> = {
  ElegantClassic: { bg: 'bg-amber-50', accent: 'border-amber-600' },
  ModernMinimal: { bg: 'bg-gray-100', accent: 'border-gray-900' },
  RomanticGarden: { bg: 'bg-pink-50', accent: 'border-pink-400' },
};

export function TemplatePicker({ selected, onSelect }: TemplatePickerProps) {
  const { t } = useTranslation('website');

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">{t('templates.title')}</h3>
        <p className="text-sm text-muted-foreground">{t('templates.description')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {templates.map((template) => {
          const info = TEMPLATE_INFO[template];
          const colors = templateColors[template];
          const isSelected = selected === template;

          return (
            <Card
              key={template}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                isSelected && `ring-2 ring-primary ${colors.accent}`
              )}
              onClick={() => onSelect(template)}
            >
              <CardContent className="p-0">
                {/* Preview placeholder - colored box instead of image */}
                <div
                  className={cn(
                    'h-40 rounded-t-lg flex items-center justify-center relative',
                    colors.bg
                  )}
                >
                  {/* Decorative elements based on template */}
                  {template === 'ElegantClassic' && (
                    <div className="text-center">
                      <div className="text-amber-800 font-serif text-2xl">E & J</div>
                      <div className="text-amber-600 text-xs mt-1 font-serif">06.15.2026</div>
                    </div>
                  )}
                  {template === 'ModernMinimal' && (
                    <div className="text-center">
                      <div className="text-gray-900 font-sans text-2xl font-light tracking-widest">
                        E + J
                      </div>
                      <div className="text-gray-500 text-xs mt-2 tracking-wide">
                        JUNE 15, 2026
                      </div>
                    </div>
                  )}
                  {template === 'RomanticGarden' && (
                    <div className="text-center">
                      <div className="text-pink-700 font-script text-3xl">Emma & James</div>
                      <div className="text-pink-500 text-xs mt-1">~ June 15th ~</div>
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h4 className="font-medium">{t(`templates.${template}.name`)}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t(`templates.${template}.description`)}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
