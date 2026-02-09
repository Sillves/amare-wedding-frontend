import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ColumnMapping } from '../../types/importTypes';

interface MappingStepProps {
  headers: string[];
  mappings: ColumnMapping[];
  onMappingsChange: (mappings: ColumnMapping[]) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

const TARGET_FIELDS = [
  { value: 'name', label: 'import.mapping.name' },
  { value: 'email', label: 'import.mapping.email' },
  { value: 'rsvpStatus', label: 'import.mapping.rsvpStatus' },
  { value: 'preferredLanguage', label: 'import.mapping.preferredLanguage' },
  { value: 'skip', label: 'import.mapping.skip' },
] as const;

export function MappingStep({ headers, mappings, onMappingsChange, onNext, onBack, isLoading }: MappingStepProps) {
  const { t } = useTranslation('guests');

  const handleFieldChange = (index: number, value: string) => {
    const updated = [...mappings];
    updated[index] = { ...updated[index], targetField: value as ColumnMapping['targetField'] };
    onMappingsChange(updated);
  };

  const hasName = mappings.some((m) => m.targetField === 'name');
  const hasEmail = mappings.some((m) => m.targetField === 'email');
  const canProceed = hasName && hasEmail;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t('import.mapping.description')}</p>

      <div className="space-y-3">
        {headers.map((header, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" title={header}>
                {header}
              </p>
            </div>
            <div className="text-muted-foreground text-sm">&rarr;</div>
            <div className="flex-1">
              <Select
                value={mappings[index]?.targetField || 'skip'}
                onValueChange={(value) => handleFieldChange(index, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TARGET_FIELDS.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {t(field.label)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}
      </div>

      {!canProceed && (
        <p className="text-sm text-amber-600">{t('import.mapping.requiredFields')}</p>
      )}

      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onBack} disabled={isLoading}>
          {t('import.back')}
        </Button>
        <Button onClick={onNext} disabled={!canProceed || isLoading}>
          {isLoading ? t('import.mapping.checking') : t('import.next')}
        </Button>
      </div>
    </div>
  );
}
