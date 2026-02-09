import { useTranslation } from 'react-i18next';
import { CheckCircle2, AlertCircle, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BulkImportGuestResult } from '../../types/importTypes';

interface ResultStepProps {
  result: BulkImportGuestResult;
  onClose: () => void;
}

export function ResultStep({ result, onClose }: ResultStepProps) {
  const { t } = useTranslation('guests');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
        <h3 className="text-lg font-semibold">{t('import.result.title')}</h3>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-lg bg-green-500/10">
          <div className="text-2xl font-bold text-green-600">{result.createdCount}</div>
          <div className="text-xs text-muted-foreground">{t('import.result.created')}</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-amber-500/10">
          <div className="text-2xl font-bold text-amber-600">{result.skippedCount}</div>
          <div className="text-xs text-muted-foreground">{t('import.result.skipped')}</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-red-500/10">
          <div className="text-2xl font-bold text-red-600">{result.errorCount}</div>
          <div className="text-xs text-muted-foreground">{t('import.result.errors')}</div>
        </div>
      </div>

      {result.errors.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{t('import.result.errorDetails')}</p>
          <div className="max-h-[150px] overflow-auto border rounded-lg p-3 space-y-2">
            {result.errors.map((err, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                {err.errorMessage.includes('Duplicate') || err.errorMessage.includes('already exists') ? (
                  <SkipForward className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                )}
                <span className="text-muted-foreground">
                  {t('import.result.row', { number: err.rowIndex + 1 })}: {err.name || err.email} — {err.errorMessage}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center pt-2">
        <Button onClick={onClose}>{t('import.result.close')}</Button>
      </div>
    </div>
  );
}
