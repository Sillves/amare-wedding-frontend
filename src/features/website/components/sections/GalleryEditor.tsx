import { useTranslation } from 'react-i18next';
import { Plus, X, Images, Upload, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Images className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <CardTitle>{t('gallery.title')}</CardTitle>
              <CardDescription>{t('gallery.subtitle')}</CardDescription>
            </div>
          </div>
          <Switch
            checked={data.enabled}
            onCheckedChange={handleToggleEnabled}
          />
        </div>
      </CardHeader>

      {data.enabled && (
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gallery-title" className="text-sm font-medium">
                {t('gallery.sectionTitle')}
              </Label>
              <Input
                id="gallery-title"
                value={data.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('gallery.displayType')}</Label>
              <Select value={data.displayType} onValueChange={handleDisplayTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">
                    <div className="flex flex-col items-start">
                      <span>{t('gallery.types.grid')}</span>
                      <span className="text-xs text-muted-foreground">{t('gallery.types.gridDesc')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="masonry">
                    <div className="flex flex-col items-start">
                      <span>{t('gallery.types.masonry')}</span>
                      <span className="text-xs text-muted-foreground">{t('gallery.types.masonryDesc')}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="carousel">
                    <div className="flex flex-col items-start">
                      <span>{t('gallery.types.carousel')}</span>
                      <span className="text-xs text-muted-foreground">{t('gallery.types.carouselDesc')}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">{t('gallery.images')}</Label>
                <p className="text-xs text-muted-foreground">
                  {data.images.length > 0
                    ? t('gallery.imageCount', { count: data.images.length })
                    : t('gallery.noImagesYet')
                  }
                </p>
              </div>
              {!disableImageUpload && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploadMedia.isPending}
                >
                  {uploadMedia.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      {t('upload.uploading')}
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      {t('gallery.addImage')}
                    </>
                  )}
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

            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {disableImageUpload && data.images.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Images className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {imageUploadDisabledMessage || t('upload.disabled')}
                </p>
              </div>
            )}

            {data.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.images.map((image) => (
                  <div key={image.id} className="relative group rounded-lg overflow-hidden border bg-muted/30">
                    <div className="aspect-square relative">
                      <img
                        src={image.url}
                        alt={image.caption || ''}
                        className="w-full h-full object-cover"
                      />
                      {!disableImageUpload && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteImage(image.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            {t('gallery.remove')}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <Input
                        value={image.caption || ''}
                        onChange={(e) => handleUpdateCaption(image.id, e.target.value)}
                        placeholder={t('gallery.caption')}
                        className="text-sm h-8"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!disableImageUpload && data.images.length === 0 && (
              <div
                className="rounded-lg border-2 border-dashed p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">
                  {t('gallery.dropzone')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('gallery.dropzoneHint')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
