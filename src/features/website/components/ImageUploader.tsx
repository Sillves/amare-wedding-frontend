import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUploadMedia } from '../hooks/useWebsite';
import type { MediaUploadResponse } from '../types';

interface ImageUploaderProps {
  weddingId: string;
  currentImageUrl?: string;
  onUpload: (media: MediaUploadResponse) => void;
  onRemove: () => void;
  accept?: string;
  maxSizeMB?: number;
  aspectRatio?: string;
  className?: string;
}

export function ImageUploader({
  weddingId,
  currentImageUrl,
  onUpload,
  onRemove,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
  aspectRatio = '16/9',
  className = '',
}: ImageUploaderProps) {
  const { t } = useTranslation('website');
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const uploadMedia = useUploadMedia();

  const handleFileChange = async (file: File | undefined) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(t('upload.fileTooLarge', { max: maxSizeMB }));
      return;
    }

    // Validate file type
    const validTypes = accept.split(',').map((t) => t.trim());
    if (!validTypes.includes(file.type)) {
      setError(t('upload.invalidType'));
      return;
    }

    setError(null);
    try {
      const media = await uploadMedia.mutateAsync({ weddingId, file });
      onUpload(media);
    } catch {
      setError(t('upload.error'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files?.[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className={className}>
      {currentImageUrl ? (
        <div className="relative" style={{ aspectRatio }}>
          <img
            src={currentImageUrl}
            alt=""
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => inputRef.current?.click()}
              disabled={uploadMedia.isPending}
            >
              {t('upload.change')}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={onRemove}
              disabled={uploadMedia.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
          `}
          style={{ aspectRatio }}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center justify-center h-full gap-2">
            {uploadMedia.isPending ? (
              <div className="animate-pulse">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground">
              {uploadMedia.isPending ? t('upload.uploading') : t('upload.dropzone')}
            </p>
            {!uploadMedia.isPending && (
              <Button type="button" variant="secondary" size="sm">
                {t('upload.browse')}
              </Button>
            )}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
