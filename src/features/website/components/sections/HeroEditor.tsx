import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ImageUploader } from '../ImageUploader';
import type { HeroContent } from '../../types';

interface HeroEditorProps {
  weddingId: string;
  data: HeroContent;
  onChange: (data: HeroContent) => void;
}

export function HeroEditor({ weddingId, data, onChange }: HeroEditorProps) {
  const { t } = useTranslation('website');

  const handleChange = <K extends keyof HeroContent>(
    field: K,
    value: HeroContent[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('hero.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="coupleNames">{t('hero.coupleNames')}</Label>
          <Input
            id="coupleNames"
            value={data.coupleNames}
            onChange={(e) => handleChange('coupleNames', e.target.value)}
            placeholder={t('hero.coupleNamesPlaceholder')}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="date">{t('hero.date')}</Label>
          <Input
            id="date"
            type="date"
            value={data.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="tagline">{t('hero.tagline')}</Label>
          <Textarea
            id="tagline"
            value={data.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder={t('hero.taglinePlaceholder')}
            rows={2}
          />
        </div>

        <div className="grid gap-2">
          <Label>{t('hero.displayStyle')}</Label>
          <Select
            value={data.displayStyle}
            onValueChange={(value) =>
              handleChange('displayStyle', value as HeroContent['displayStyle'])
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="centered">{t('hero.styles.centered')}</SelectItem>
              <SelectItem value="left">{t('hero.styles.left')}</SelectItem>
              <SelectItem value="overlay">{t('hero.styles.overlay')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>{t('hero.backgroundImage')}</Label>
          <ImageUploader
            weddingId={weddingId}
            currentImageUrl={data.backgroundImageUrl}
            onUpload={(media) => {
              onChange({
                ...data,
                backgroundImageId: media.id,
                backgroundImageUrl: media.url,
              });
            }}
            onRemove={() => {
              onChange({
                ...data,
                backgroundImageId: undefined,
                backgroundImageUrl: undefined,
              });
            }}
            aspectRatio="16/9"
          />
        </div>
      </CardContent>
    </Card>
  );
}
