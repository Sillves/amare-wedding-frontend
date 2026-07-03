import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import type { QuestionDefinition } from '@/features/rsvp/types';

interface ResponseAnswersProps {
  answers: Record<string, unknown>;
  questions: QuestionDefinition[];
}

interface AnswerRow {
  key: string;
  label: string;
  value: string;
}

/** True when a single answer value counts as "answered" (non-empty). */
function isAnswered(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.some((v) => v !== null && v !== undefined && v !== '');
  return true;
}

/** True when a response has at least one non-empty custom answer (drives the chevron). */
export function hasResponseAnswers(answers: Record<string, unknown> | null | undefined): boolean {
  if (!answers) return false;
  return Object.values(answers).some(isAnswered);
}

/**
 * Renders the question/answer pairs for a single RSVP response.
 *
 * Questions are shown in the flow-definition order. Answers whose question id is
 * no longer present in the flow (question or flow deleted) are appended with a
 * "(deleted question)" label so no submitted data silently disappears.
 */
export function ResponseAnswers({ answers, questions }: ResponseAnswersProps) {
  const { t } = useTranslation('rsvp');

  const formatValue = (value: unknown): string => {
    if (typeof value === 'boolean') {
      return value ? t('public.yes') : t('public.no');
    }
    if (Array.isArray(value)) {
      const parts = value.filter((v) => v !== null && v !== undefined && v !== '');
      return parts.length > 0 ? parts.map((v) => String(v)).join(', ') : '—';
    }
    if (typeof value === 'string') {
      return value.trim() === '' ? '—' : value;
    }
    if (value === null || value === undefined) {
      return '—';
    }
    return String(value);
  };

  const knownIds = new Set<string>();
  const rows: AnswerRow[] = [];

  // Questions in flow-definition order that have an answer.
  for (const question of questions) {
    const id = question.id;
    if (!id) continue;
    knownIds.add(id);
    const value = answers[id];
    if (!isAnswered(value)) continue;
    rows.push({
      key: id,
      label: question.label ?? '',
      value: formatValue(value),
    });
  }

  // Orphaned answers: ids present in the response but not (any longer) in the flow.
  for (const [id, value] of Object.entries(answers)) {
    if (knownIds.has(id)) continue;
    if (!isAnswered(value)) continue;
    rows.push({
      key: id,
      label: t('planner.answers.deletedQuestion'),
      value: formatValue(value),
    });
  }

  if (rows.length === 0) return null;

  return (
    <div className="space-y-2 py-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {t('planner.answers.title')}
      </p>
      <dl className="grid gap-x-6 gap-y-1.5 sm:grid-cols-[minmax(0,14rem)_1fr]">
        {rows.map((row) => (
          <Fragment key={row.key}>
            <dt className="text-sm font-medium">{row.label}</dt>
            <dd className="mb-1 text-sm text-muted-foreground sm:mb-0">{row.value}</dd>
          </Fragment>
        ))}
      </dl>
    </div>
  );
}
