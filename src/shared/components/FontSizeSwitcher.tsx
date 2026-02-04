import { Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useFontSizeStore, type FontSize } from '@/lib/fontSizeStore';
import { useTranslation } from 'react-i18next';

const fontSizeOptions: { value: FontSize; labelKey: string; scale: string }[] = [
  { value: 'normal', labelKey: 'common:accessibility.fontNormal', scale: 'A' },
  { value: 'large', labelKey: 'common:accessibility.fontLarge', scale: 'A+' },
  { value: 'x-large', labelKey: 'common:accessibility.fontXLarge', scale: 'A++' },
];

export function FontSizeSwitcher() {
  const { t } = useTranslation(['common']);
  const { fontSize, setFontSize } = useFontSizeStore();

  const currentOption = fontSizeOptions.find(o => o.value === fontSize) || fontSizeOptions[0];

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label={t('common:accessibility.fontSize')}
        >
          <Type className="h-4 w-4 mr-1" />
          <span className="text-xs font-bold">{currentOption.scale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {fontSizeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setFontSize(option.value)}
            className={fontSize === option.value ? 'bg-accent' : ''}
          >
            <span className="font-mono mr-2 w-8">{option.scale}</span>
            <span>{t(option.labelKey)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
