import { useTranslation } from 'react-i18next';
import { Heart, Info } from 'lucide-react';
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
import { DatePicker } from '@/components/ui/date-time-picker';
import { ImageUploader } from '../ImageUploader';
import type { HeroContent } from '../../types';

interface HeroEditorProps {
  weddingId: string;
  data: HeroContent;
  onChange: (data: HeroContent) => void;
  disableImageUpload?: boolean;
  imageUploadDisabledMessage?: string;
}

const MAX_TAGLINE_LENGTH = 120;

export function HeroEditor({ weddingId, data, onChange, disableImageUpload, imageUploadDisabledMessage }: HeroEditorProps) {
  const { t } = useTranslation('website');

  const handleChange = <K extends keyof HeroContent>(
    field: K,
    value: HeroContent[K]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const taglineLength = data.tagline?.length || 0;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30">
            <Heart className="h-5 w-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <CardTitle>{t('hero.title')}</CardTitle>
            <CardDescription>{t('hero.subtitle')}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Couple Names */}
        <div className="space-y-2">
          <Label htmlFor="coupleNames" className="text-sm font-medium">
            {t('hero.coupleNames')}
          </Label>
          <Input
            id="coupleNames"
            value={data.coupleNames}
            onChange={(e) => handleChange('coupleNames', e.target.value)}
            placeholder={t('hero.coupleNamesPlaceholder')}
            className="text-base"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            {t('hero.coupleNamesHint')}
          </p>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('hero.date')}</Label>
          <DatePicker
            value={data.date ? new Date(data.date) : undefined}
            onChange={(date) => handleChange('date', date ? date.toISOString().split('T')[0] : '')}
            placeholder={t('hero.datePlaceholder')}
          />
        </div>

        {/* Tagline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="tagline" className="text-sm font-medium">
              {t('hero.tagline')}
            </Label>
            <span className={`text-xs ${taglineLength > MAX_TAGLINE_LENGTH ? 'text-destructive' : 'text-muted-foreground'}`}>
              {taglineLength}/{MAX_TAGLINE_LENGTH}
            </span>
          </div>
          <Textarea
            id="tagline"
            value={data.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder={t('hero.taglinePlaceholder')}
            rows={2}
            className="resize-none"
          />
        </div>

        {/* Display Style */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('hero.displayStyle')}</Label>
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
              <SelectItem value="centered">
                <div className="flex flex-col items-start">
                  <span>{t('hero.styles.centered')}</span>
                  <span className="text-xs text-muted-foreground">{t('hero.styles.centeredDesc')}</span>
                </div>
              </SelectItem>
              <SelectItem value="left">
                <div className="flex flex-col items-start">
                  <span>{t('hero.styles.left')}</span>
                  <span className="text-xs text-muted-foreground">{t('hero.styles.leftDesc')}</span>
                </div>
              </SelectItem>
              <SelectItem value="overlay">
                <div className="flex flex-col items-start">
                  <span>{t('hero.styles.overlay')}</span>
                  <span className="text-xs text-muted-foreground">{t('hero.styles.overlayDesc')}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Background Image */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t('hero.backgroundImage')}</Label>
          <p className="text-xs text-muted-foreground mb-2">{t('hero.backgroundImageHint')}</p>
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
            disabled={disableImageUpload}
            disabledMessage={imageUploadDisabledMessage}
          />
        </div>
      </CardContent>
    </Card>
  );
}
