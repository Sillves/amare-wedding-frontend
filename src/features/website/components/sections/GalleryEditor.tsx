import { useTranslation } from 'react-i18next';
import { Plus, Trash2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUploadMedia } from '../../hooks/useWebsite';
import type { GalleryContent, GalleryImage } from '../../types';
import { useRef, useState } from 'react';

interface GalleryEditorProps {
  weddingId: string;
  data: GalleryContent;
  onChange: (data: GalleryContent) => void;
  disableImageUpload?: boolean;
  imageUploadDisabledMessage?: string;
}

export function GalleryEditor({ weddingId, data, onChange, disableImageUpload, imageUploadDisabledMessage }: GalleryEditorProps) {
  const { t } = useTranslation('website');
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadMedia = useUploadMedia();

  const handleToggleEnabled = (enabled: boolean) => {
    onChange({ ...data, enabled });
  };

  const handleTitleChange = (title: string) => {
    onChange({ ...data, title });
  };

  const handleDisplayTypeChange = (displayType: GalleryContent['displayType']) => {
    onChange({ ...data, displayType });
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files) return;

    setError(null);
    const newImages: GalleryImage[] = [];

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setError(t('upload.fileTooLarge', { max: 5 }));
        continue;
      }

      try {
        const media = await uploadMedia.mutateAsync({ weddingId, file });
        newImages.push({
          id: crypto.randomUUID(),
          mediaId: media.id,
          url: media.url,
        });
      } catch {
        setError(t('upload.error'));
      }
    }

    if (newImages.length > 0) {
      onChange({ ...data, images: [...data.images, ...newImages] });
    }
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    onChange({
      ...data,
      images: data.images.map((img) =>
        img.id === id ? { ...img, caption } : img
      ),
    });
  };

  const handleDeleteImage = (id: string) => {
    onChange({
      ...data,
      images: data.images.filter((img) => img.id !== id),
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('gallery.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="gallery-enabled" className="text-sm font-normal">
              {t('gallery.enabled')}
            </Label>
            <Switch
              id="gallery-enabled"
              checked={data.enabled}
              onCheckedChange={handleToggleEnabled}
            />
          </div>
        </div>
      </CardHeader>

      {data.enabled && (
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="gallery-title">{t('gallery.sectionTitle')}</Label>
            <Input
              id="gallery-title"
              value={data.title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>{t('gallery.displayType')}</Label>
            <Select value={data.displayType} onValueChange={handleDisplayTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">{t('gallery.types.grid')}</SelectItem>
                <SelectItem value="masonry">{t('gallery.types.masonry')}</SelectItem>
                <SelectItem value="carousel">{t('gallery.types.carousel')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('gallery.images')}</Label>
              {!disableImageUpload && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploadMedia.isPending}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {uploadMedia.isPending ? t('upload.uploading') : t('gallery.addImage')}
                </Button>
              )}
            </div>

            {!disableImageUpload && (
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => handleUploadImages(e.target.files)}
                className="hidden"
              />
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            {disableImageUpload && data.images.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                {imageUploadDisabledMessage || t('upload.disabled')}
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {data.images.map((image) => (
                <div key={image.id} className="relative group">
                  <img
                    src={image.url}
                    alt={image.caption || ''}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  {!disableImageUpload && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  <Input
                    value={image.caption || ''}
                    onChange={(e) => handleUpdateCaption(image.id, e.target.value)}
                    placeholder={t('gallery.caption')}
                    className="mt-2 text-sm"
                  />
                </div>
              ))}
            </div>

            {!disableImageUpload && data.images.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                {t('gallery.noImages')}
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
