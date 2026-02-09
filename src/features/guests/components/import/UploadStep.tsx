import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, FileSpreadsheet, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateTemplate } from '../../utils/importUtils';
import { cn } from '@/lib/utils';

interface UploadStepProps {
  onFileSelected: (file: File) => void;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/vnd.ms-excel',
];
const ACCEPTED_EXTENSIONS = '.xlsx,.csv';

export function UploadStep({ onFileSelected }: UploadStepProps) {
  const { t } = useTranslation('guests');
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndSelect = (file: File | undefined) => {
    if (!file) return;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(t('import.upload.fileTooLarge', { max: MAX_SIZE_MB }));
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'csv') {
      setError(t('import.upload.invalidType'));
      return;
    }

    setError(null);
    onFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    validateAndSelect(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
          dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50',
          error && 'border-destructive'
        )}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          className="hidden"
          onChange={(e) => validateAndSelect(e.target.files?.[0])}
        />

        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-muted">
            {dragOver ? (
              <FileSpreadsheet className="h-8 w-8 text-primary" />
            ) : (
              <Upload className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="font-medium">{t('import.upload.dropzone')}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {t('import.upload.formats')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('import.upload.maxSize', { max: MAX_SIZE_MB })}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            generateTemplate();
          }}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          {t('import.upload.downloadTemplate')}
        </Button>
      </div>
    </div>
  );
}
