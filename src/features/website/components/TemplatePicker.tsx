import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { WebsiteTemplate } from '../types';
import { WebsiteTemplateNames } from '../types';
import { TEMPLATE_INFO } from '../utils/defaultContent';

interface TemplatePickerProps {
  selected: WebsiteTemplate;
  onSelect: (template: WebsiteTemplate) => void;
}

// Template values as numbers (matching backend enum)
const templates: WebsiteTemplate[] = [0, 1, 2]; // ElegantClassic, ModernMinimal, RomanticGarden

// Elegant Classic Preview - Sophisticated serif design with initials
const ElegantClassicPreview = () => (
  <div className="h-full w-full bg-[#faf9f7] flex flex-col items-center justify-center p-4 relative overflow-hidden">
    {/* Subtle decorative lines */}
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9b8a5]/40 to-transparent" />
    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9b8a5]/40 to-transparent" />

    {/* Initials with separator */}
    <div className="flex items-center gap-2 mb-3">
      <span className="font-serif text-3xl text-[#4a4a4a] font-light">E</span>
      <div className="w-px h-8 bg-[#4a4a4a]" />
      <span className="font-serif text-3xl text-[#4a4a4a] font-light">J</span>
    </div>

    {/* Script tagline */}
    <p
      className="text-[#6a6a6a] text-sm italic mb-2"
      style={{ fontFamily: "'Pinyon Script', cursive" }}
    >
      We're getting married
    </p>

    {/* Names */}
    <div className="text-center">
      <span className="font-serif text-xs tracking-[0.2em] text-[#4a4a4a] uppercase">
        Emma
      </span>
      <span
        className="block text-xs text-[#4a4a4a] my-0.5 italic"
        style={{ fontFamily: "'Pinyon Script', cursive" }}
      >
        and
      </span>
      <span className="font-serif text-xs tracking-[0.2em] text-[#4a4a4a] uppercase">
        James
      </span>
    </div>

    {/* Date */}
    <p className="text-[#6a6a6a] text-[10px] tracking-[0.15em] mt-2 uppercase">
      June 15, 2026
    </p>
  </div>
);

// Modern Minimal Preview - Clean contemporary design
const ModernMinimalPreview = () => (
  <div className="h-full w-full bg-white flex flex-col items-center justify-center p-4 relative">
    {/* Subtle border frame */}
    <div className="absolute inset-3 border border-[#e5e5e5]" />

    {/* Label */}
    <span className="text-[8px] tracking-[0.3em] text-[#6b6b6b] uppercase mb-2">
      The Wedding Of
    </span>

    {/* Names with ampersand */}
    <div className="text-center">
      <span className="block font-serif text-xl text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
        Emma
      </span>
      <span className="block text-lg text-[#c4b5a0] italic my-0.5" style={{ fontFamily: "'Playfair Display', serif" }}>
        &
      </span>
      <span className="block font-serif text-xl text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
        James
      </span>
    </div>

    {/* Diamond divider */}
    <div className="flex items-center gap-2 my-3">
      <div className="w-8 h-px bg-[#c4b5a0]" />
      <div className="w-2 h-2 border border-[#c4b5a0] rotate-45" />
      <div className="w-8 h-px bg-[#c4b5a0]" />
    </div>

    {/* Date display */}
    <div className="flex items-center gap-2">
      <span className="font-serif text-2xl text-[#1a1a1a]" style={{ fontFamily: "'Playfair Display', serif" }}>
        15
      </span>
      <div className="w-px h-6 bg-[#c4b5a0]" />
      <div className="text-left">
        <span className="block text-[8px] tracking-[0.15em] text-[#1a1a1a] uppercase">June</span>
        <span className="block text-[7px] tracking-[0.1em] text-[#6b6b6b]">2026</span>
      </div>
    </div>
  </div>
);

// Romantic Garden Preview - Whimsical floral design
const RomanticGardenPreview = () => (
  <div className="h-full w-full bg-[#fdfbf9] flex flex-col items-center justify-center p-4 relative overflow-hidden">
    {/* Corner floral hints */}
    <div className="absolute -top-2 -left-2 w-12 h-12 opacity-30">
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <path d="M5 5 Q15 15 20 35" fill="none" stroke="#8fa882" strokeWidth="1" />
        <path d="M15 10c-3-5-1-10-1-10s3 3 5 4c-4-1-4-3-4-3z" fill="#8fa882" opacity="0.7" />
        <circle cx="8" cy="8" r="4" fill="#d4a5a5" opacity="0.6" />
      </svg>
    </div>
    <div className="absolute -bottom-2 -right-2 w-12 h-12 opacity-30 rotate-180">
      <svg viewBox="0 0 50 50" className="w-full h-full">
        <path d="M5 5 Q15 15 20 35" fill="none" stroke="#8fa882" strokeWidth="1" />
        <path d="M15 10c-3-5-1-10-1-10s3 3 5 4c-4-1-4-3-4-3z" fill="#8fa882" opacity="0.7" />
        <circle cx="8" cy="8" r="4" fill="#d4a5a5" opacity="0.6" />
      </svg>
    </div>

    {/* Floral divider top */}
    <svg viewBox="0 0 100 20" className="w-20 h-4 mb-2">
      <path d="M0 10 Q25 5 40 10" fill="none" stroke="#8fa882" strokeWidth="0.8" />
      <path d="M60 10 Q75 5 100 10" fill="none" stroke="#8fa882" strokeWidth="0.8" />
      <circle cx="50" cy="10" r="4" fill="#d4a5a5" opacity="0.8" />
      <circle cx="50" cy="10" r="2" fill="#6b5c4c" opacity="0.5" />
    </svg>

    {/* Together text */}
    <p className="text-[8px] text-[#8a7f74] italic mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      Together with their families
    </p>

    {/* Names in script */}
    <h3
      className="text-2xl text-[#6b5c4c] mb-1"
      style={{ fontFamily: "'Great Vibes', cursive" }}
    >
      Emma & James
    </h3>

    {/* Date with leaf accents */}
    <div className="flex items-center gap-2 mt-1">
      <svg viewBox="0 0 20 15" className="w-4 h-3">
        <path d="M2 12 Q8 8 15 3" fill="none" stroke="#8fa882" strokeWidth="0.8" />
        <path d="M8 8c-3-4-1-8-1-8s2 2 4 3c-3 0-3-2-3-2z" fill="#8fa882" opacity="0.7" />
      </svg>
      <span className="text-[10px] text-[#5a4f46]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        June 15, 2026
      </span>
      <svg viewBox="0 0 20 15" className="w-4 h-3 scale-x-[-1]">
        <path d="M2 12 Q8 8 15 3" fill="none" stroke="#8fa882" strokeWidth="0.8" />
        <path d="M8 8c-3-4-1-8-1-8s2 2 4 3c-3 0-3-2-3-2z" fill="#8fa882" opacity="0.7" />
      </svg>
    </div>

    {/* Floral divider bottom */}
    <svg viewBox="0 0 100 20" className="w-20 h-4 mt-2">
      <path d="M0 10 Q25 15 40 10" fill="none" stroke="#8fa882" strokeWidth="0.8" />
      <path d="M60 10 Q75 15 100 10" fill="none" stroke="#8fa882" strokeWidth="0.8" />
      <circle cx="50" cy="10" r="4" fill="#d4a5a5" opacity="0.8" />
      <circle cx="50" cy="10" r="2" fill="#6b5c4c" opacity="0.5" />
    </svg>
  </div>
);

const templatePreviews: Record<WebsiteTemplate, React.FC> = {
  0: ElegantClassicPreview,
  1: ModernMinimalPreview,
  2: RomanticGardenPreview,
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
          const templateName = WebsiteTemplateNames[template];
          const isSelected = selected === template;
          const PreviewComponent = templatePreviews[template];

          return (
            <Card
              key={template}
              className={cn(
                'cursor-pointer transition-all hover:shadow-lg overflow-hidden',
                isSelected && 'ring-2 ring-primary'
              )}
              onClick={() => onSelect(template)}
            >
              <CardContent className="p-0">
                {/* Template preview */}
                <div className="h-44 relative">
                  <PreviewComponent />

                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>

                <div className="p-4 border-t">
                  <h4 className="font-medium">{t(`templates.${templateName}.name`)}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {t(`templates.${templateName}.description`)}
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
