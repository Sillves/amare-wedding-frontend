import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ImportGuestRow } from '../../types/importTypes';
import { cn } from '@/lib/utils';

interface PreviewStepProps {
  rows: ImportGuestRow[];
  onRemoveInvalid: () => void;
  onImport: () => void;
  onBack: () => void;
  isImporting: boolean;
}

const RSVP_LABELS: Record<number, string> = {
  0: 'Pending',
  1: 'Accepted',
  2: 'Declined',
  3: 'Maybe',
};

export function PreviewStep({ rows, onRemoveInvalid, onImport, onBack, isImporting }: PreviewStepProps) {
  const { t } = useTranslation('guests');

  const validCount = rows.filter((r) => r.isValid).length;
  const invalidCount = rows.filter((r) => !r.isValid).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t('import.preview.summary', { valid: validCount, invalid: invalidCount, total: rows.length })}
        </div>
        {invalidCount > 0 && (
          <Button variant="outline" size="sm" onClick={onRemoveInvalid}>
            {t('import.preview.removeInvalid')}
          </Button>
        )}
      </div>

      <div className="border rounded-lg max-h-[300px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>{t('import.mapping.name')}</TableHead>
              <TableHead>{t('import.mapping.email')}</TableHead>
              <TableHead>{t('import.mapping.rsvpStatus')}</TableHead>
              <TableHead>{t('import.mapping.preferredLanguage')}</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.rowIndex}
                className={cn(!row.isValid && 'bg-destructive/10')}
              >
                <TableCell className="text-muted-foreground text-xs">
                  {row.rowIndex + 1}
                </TableCell>
                <TableCell className="font-medium">{row.name || '—'}</TableCell>
                <TableCell>{row.email || '—'}</TableCell>
                <TableCell>{RSVP_LABELS[row.rsvpStatus] ?? 'Pending'}</TableCell>
                <TableCell>{row.preferredLanguage || '—'}</TableCell>
                <TableCell>
                  {!row.isValid && (
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="text-base max-w-xs">
                          {row.errors.join(', ')}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} disabled={isImporting}>
          {t('import.back')}
        </Button>
        <Button onClick={onImport} disabled={validCount === 0 || isImporting}>
          {isImporting
            ? t('import.preview.importing')
            : t('import.preview.importButton', { count: validCount })}
        </Button>
      </div>
    </div>
  );
}
