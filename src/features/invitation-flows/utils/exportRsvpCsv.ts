import type { QuestionDefinition, RsvpResponseDto } from '@/features/rsvp/types';

/** Column headers and value labels, supplied translated by the caller. */
export interface RsvpCsvLabels {
  name: string;
  surname: string;
  email: string;
  flow: string;
  status: string;
  plusOne: string;
  dietary: string;
  events: string;
  submittedAt: string;
  attending: string;
  declined: string;
  yes: string;
  no: string;
  deletedQuestion: string;
}

interface QuestionColumn {
  id: string;
  label: string;
}

/** Wraps a value in quotes when it contains a delimiter, quote or newline; doubles inner quotes. */
function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Formats a single custom-answer value the same way the on-screen answer list does. */
function formatAnswer(value: unknown, labels: RsvpCsvLabels): string {
  if (typeof value === 'boolean') {
    return value ? labels.yes : labels.no;
  }
  if (Array.isArray(value)) {
    return value
      .filter((v) => v !== null && v !== undefined && v !== '')
      .map((v) => String(v))
      .join(', ');
  }
  if (value === null || value === undefined) {
    return '';
  }
  return String(value);
}

/**
 * Collects the custom-question columns across all flows, in flow-definition order,
 * then appends any orphaned answer ids (question or flow deleted) so no submitted
 * data is dropped from the export. Mirrors ResponseAnswers ordering.
 */
function collectQuestionColumns(
  responses: RsvpResponseDto[],
  questionsByFlow: Map<string, QuestionDefinition[]>,
  labels: RsvpCsvLabels
): QuestionColumn[] {
  const columns: QuestionColumn[] = [];
  const seen = new Set<string>();

  for (const questions of questionsByFlow.values()) {
    for (const question of questions) {
      if (!question.id || seen.has(question.id)) continue;
      seen.add(question.id);
      columns.push({ id: question.id, label: question.label ?? '' });
    }
  }

  for (const response of responses) {
    const answers = response.customAnswers ?? {};
    for (const id of Object.keys(answers)) {
      if (seen.has(id)) continue;
      seen.add(id);
      columns.push({ id, label: labels.deletedQuestion });
    }
  }

  return columns;
}

function formatStatus(status: RsvpResponseDto['status'], labels: RsvpCsvLabels): string {
  if (status === 'Attending') return labels.attending;
  if (status === 'Declined') return labels.declined;
  return '';
}

function formatSubmittedAt(submittedAt: string | undefined): string {
  if (!submittedAt) return '';
  const date = new Date(submittedAt);
  return Number.isNaN(date.getTime()) ? submittedAt : date.toLocaleString();
}

/**
 * Builds the full CSV text (with a UTF-8 BOM and CRLF line endings so Excel opens
 * accented characters correctly) for the given RSVP responses.
 */
export function buildRsvpResponsesCsv(
  responses: RsvpResponseDto[],
  questionsByFlow: Map<string, QuestionDefinition[]>,
  labels: RsvpCsvLabels
): string {
  const questionColumns = collectQuestionColumns(responses, questionsByFlow, labels);

  const header = [
    labels.name,
    labels.surname,
    labels.email,
    labels.flow,
    labels.status,
    labels.plusOne,
    labels.dietary,
    labels.events,
    labels.submittedAt,
    ...questionColumns.map((c) => c.label),
  ];

  const rows = responses.map((r) => {
    const answers = r.customAnswers ?? {};
    return [
      r.name ?? '',
      r.surname ?? '',
      r.email ?? '',
      r.flowName ?? '',
      formatStatus(r.status, labels),
      r.isPlusOne ? labels.yes : labels.no,
      r.dietary ?? '',
      (r.attendingEventNames ?? []).join(', '),
      formatSubmittedAt(r.submittedAt),
      ...questionColumns.map((c) => formatAnswer(answers[c.id], labels)),
    ];
  });

  const lines = [header, ...rows].map((cells) =>
    cells.map((cell) => escapeCsvField(cell)).join(',')
  );

  return `﻿${lines.join('\r\n')}`;
}

/** Triggers a browser download of the given CSV text. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
