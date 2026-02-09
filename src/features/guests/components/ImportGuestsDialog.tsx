import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useImportGuests } from '../hooks/useGuests';
import { useErrorToast } from '@/hooks/useErrorToast';
import { guestsApi } from '../api/guestsApi';
import {
  parseFile,
  autoMapColumns,
  applyMapping,
  validateRow,
  detectDuplicateEmails,
  markExistingEmails,
} from '../utils/importUtils';
import type {
  ImportStep,
  ImportGuestRow,
  ColumnMapping,
  BulkImportGuestResult,
} from '../types/importTypes';
import { StepIndicator } from './import/StepIndicator';
import { UploadStep } from './import/UploadStep';
import { MappingStep } from './import/MappingStep';
import { PreviewStep } from './import/PreviewStep';
import { ResultStep } from './import/ResultStep';

interface ImportGuestsDialogProps {
  weddingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportGuestsDialog({ weddingId, open, onOpenChange }: ImportGuestsDialogProps) {
  const { t } = useTranslation('guests');
  const importGuests = useImportGuests();
  const { showError } = useErrorToast();

  const [step, setStep] = useState<ImportStep>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [previewRows, setPreviewRows] = useState<ImportGuestRow[]>([]);
  const [result, setResult] = useState<BulkImportGuestResult | null>(null);
  const [isCheckingEmails, setIsCheckingEmails] = useState(false);

  const reset = useCallback(() => {
    setStep('upload');
    setHeaders([]);
    setRawRows([]);
    setMappings([]);
    setPreviewRows([]);
    setResult(null);
    setIsCheckingEmails(false);
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
    }
    onOpenChange(open);
  };

  const handleFileSelected = async (file: File) => {
    try {
      const parsed = await parseFile(file);
      if (parsed.headers.length === 0 || parsed.rows.length === 0) {
        showError(t('import.upload.emptyFile'));
        return;
      }
      setHeaders(parsed.headers);
      setRawRows(parsed.rows);
      setMappings(autoMapColumns(parsed.headers));
      setStep('mapping');
    } catch {
      showError(t('import.upload.parseError'));
    }
  };

  const handleMappingNext = async () => {
    let rows = applyMapping(rawRows, mappings);
    rows = rows.map(validateRow);
    rows = detectDuplicateEmails(rows);

    // Check which emails already exist in the DB
    const validEmails = rows.filter((r) => r.isValid && r.email).map((r) => r.email);
    if (validEmails.length > 0) {
      setIsCheckingEmails(true);
      try {
        const existingEmails = await guestsApi.checkEmails(weddingId, validEmails);
        if (existingEmails.length > 0) {
          rows = markExistingEmails(rows, existingEmails);
        }
      } catch {
        // Non-blocking: if the check fails, proceed without it
      } finally {
        setIsCheckingEmails(false);
      }
    }

    setPreviewRows(rows);
    setStep('preview');
  };

  const handleRemoveInvalid = () => {
    setPreviewRows((prev) => {
      const valid = prev.filter((r) => r.isValid);
      // Re-index
      return valid.map((r, i) => ({ ...r, rowIndex: i }));
    });
  };

  const handleImport = async () => {
    const validRows = previewRows.filter((r) => r.isValid);
    if (validRows.length === 0) return;

    try {
      const importResult = await importGuests.mutateAsync({
        weddingId,
        data: {
          guests: validRows.map((r) => ({
            name: r.name,
            email: r.email,
            rsvpStatus: r.rsvpStatus,
            preferredLanguage: r.preferredLanguage || undefined,
          })),
        },
      });
      setResult(importResult);
      setStep('result');
    } catch (error) {
      showError(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="font-serif">{t('import.title')}</DialogTitle>
          <DialogDescription>{t('import.description')}</DialogDescription>
        </DialogHeader>

        <StepIndicator currentStep={step} />

        {step === 'upload' && (
          <UploadStep onFileSelected={handleFileSelected} />
        )}

        {step === 'mapping' && (
          <MappingStep
            headers={headers}
            mappings={mappings}
            onMappingsChange={setMappings}
            onNext={handleMappingNext}
            onBack={() => setStep('upload')}
            isLoading={isCheckingEmails}
          />
        )}

        {step === 'preview' && (
          <PreviewStep
            rows={previewRows}
            onRemoveInvalid={handleRemoveInvalid}
            onImport={handleImport}
            onBack={() => setStep('mapping')}
            isImporting={importGuests.isPending}
          />
        )}

        {step === 'result' && result && (
          <ResultStep
            result={result}
            onClose={() => handleOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
