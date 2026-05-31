import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import type { QuestionDefinition } from '@/features/rsvp/types';

export type AnswerValue = boolean | string | string[] | undefined;

interface Props {
  question: QuestionDefinition;
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
}

export function DynamicQuestion({ question, value, onChange }: Props) {
  const { t } = useTranslation('rsvp');
  return (
    <div className="space-y-2">
      <Label>
        {question.label}
        {question.required && <span className="text-destructive"> *</span>}
      </Label>

      {question.type === 'FreeText' && (
        <Input
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={question.required ?? false}
        />
      )}

      {question.type === 'YesNo' && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant={value === true ? 'default' : 'outline'}
            onClick={() => onChange(true)}
          >
            {t('public.yes')}
          </Button>
          <Button
            type="button"
            variant={value === false ? 'default' : 'outline'}
            onClick={() => onChange(false)}
          >
            {t('public.no')}
          </Button>
        </div>
      )}

      {question.type === 'SingleChoice' && (
        <RadioGroup value={(value as string) ?? ''} onValueChange={onChange}>
          {(question.options ?? []).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm">
              <RadioGroupItem value={opt} />
              {opt}
            </label>
          ))}
        </RadioGroup>
      )}

      {question.type === 'MultiChoice' && (
        <div className="grid gap-2">
          {(question.options ?? []).map((opt) => {
            const selected = Array.isArray(value) ? value : [];
            return (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selected.includes(opt)}
                  onCheckedChange={(c) =>
                    onChange(c ? [...selected, opt] : selected.filter((o) => o !== opt))
                  }
                />
                {opt}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}
