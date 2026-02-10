import * as XLSX from 'xlsx';
import type { RsvpStatus } from '@/features/weddings/types';
import type { ImportGuestRow, ColumnMapping } from '../types/importTypes';

/**
 * Parse an uploaded .xlsx or .csv file into headers + raw string rows
 */
export async function parseFile(file: File): Promise<{ headers: string[]; rows: string[][] }> {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    return { headers: [], rows: [] };
  }
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    return { headers: [], rows: [] };
  }
  const json: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  const firstRow = json[0];
  if (!firstRow) {
    return { headers: [], rows: [] };
  }

  const allHeaders = firstRow.map((h) => String(h).trim());
  const dataRows = json.slice(1);

  const keepIndexes = allHeaders.reduce<number[]>((acc, h, i) => {
    if (h !== '') {
      acc.push(i);
    } else if (dataRows.some((row) => String(row[i] ?? '').trim() !== '')) {
      acc.push(i);
    }
    return acc;
  }, []);

  let colCounter = 1;
  const headers = keepIndexes.map((i) => {
    const h = allHeaders[i] ?? '';
    return h !== '' ? h : `Column ${colCounter++}`;
  });
  const rows = dataRows
    .map((row) => keepIndexes.map((i) => String(row[i] ?? '')))
    .filter((row) => row.some((cell) => cell.trim() !== ''));

  return { headers, rows };
}

/**
 * Known aliases for column auto-mapping (EN/NL/FR)
 */
const COLUMN_ALIASES: Record<string, 'name' | 'email' | 'rsvpStatus' | 'preferredLanguage'> = {
  // English
  name: 'name',
  'full name': 'name',
  'guest name': 'name',
  'first name': 'name',
  email: 'email',
  'e-mail': 'email',
  'email address': 'email',
  'rsvp status': 'rsvpStatus',
  rsvp: 'rsvpStatus',
  status: 'rsvpStatus',
  'preferred language': 'preferredLanguage',
  language: 'preferredLanguage',
  lang: 'preferredLanguage',
  // Dutch
  naam: 'name',
  volledige_naam: 'name',
  'volledige naam': 'name',
  gastnaam: 'name',
  'e-mailadres': 'email',
  emailadres: 'email',
  taal: 'preferredLanguage',
  voorkeurstaal: 'preferredLanguage',
  // French
  nom: 'name',
  'nom complet': 'name',
  prénom: 'name',
  courriel: 'email',
  adresse_email: 'email',
  statut: 'rsvpStatus',
  'statut rsvp': 'rsvpStatus',
  langue: 'preferredLanguage',
  'langue préférée': 'preferredLanguage',
};

/**
 * Auto-map column headers to guest fields using fuzzy matching
 */
export function autoMapColumns(headers: string[]): ColumnMapping[] {
  const usedFields = new Set<string>();

  return headers.map((header) => {
    const normalized = header.toLowerCase().trim();
    const targetField = COLUMN_ALIASES[normalized];

    if (targetField && !usedFields.has(targetField)) {
      usedFields.add(targetField);
      return { sourceColumn: header, targetField };
    }

    return { sourceColumn: header, targetField: 'skip' as const };
  });
}

/**
 * Parse RSVP status string to numeric enum value
 */
function parseRsvpStatus(value: string): RsvpStatus {
  const normalized = value.toLowerCase().trim();
  const map: Record<string, RsvpStatus> = {
    pending: 0,
    accepted: 1,
    attending: 1,
    declined: 2,
    maybe: 3,
    // Dutch
    'in afwachting': 0,
    komt: 1,
    'komt niet': 2,
    misschien: 3,
    // French
    'en attente': 0,
    présent: 1,
    décliné: 2,
    'peut-être': 3,
  };
  return map[normalized] ?? 0;
}

/**
 * Apply column mapping to convert raw rows into ImportGuestRow[]
 */
export function applyMapping(rows: string[][], mappings: ColumnMapping[]): ImportGuestRow[] {
  const fieldIndexes: Record<string, number> = {};
  mappings.forEach((m, i) => {
    if (m.targetField !== 'skip') {
      fieldIndexes[m.targetField] = i;
    }
  });

  return rows.map((row, rowIndex) => {
    const name = (fieldIndexes.name !== undefined ? String(row[fieldIndexes.name] ?? '').trim() : '');
    const email = (fieldIndexes.email !== undefined ? String(row[fieldIndexes.email] ?? '').trim() : '');
    const rsvpRaw = fieldIndexes.rsvpStatus !== undefined ? String(row[fieldIndexes.rsvpStatus] ?? '').trim() : '';
    const langRaw = fieldIndexes.preferredLanguage !== undefined ? String(row[fieldIndexes.preferredLanguage] ?? '').trim() : '';

    const rsvpStatus = rsvpRaw ? parseRsvpStatus(rsvpRaw) : 0;
    const preferredLanguage = langRaw || 'en';

    return {
      rowIndex,
      name,
      email,
      rsvpStatus,
      preferredLanguage,
      errors: [],
      isValid: true,
    };
  });
}

/**
 * Client-side validation of a single import row
 */
export function validateRow(row: ImportGuestRow): ImportGuestRow {
  const errors: string[] = [];

  if (!row.name.trim()) {
    errors.push('Name is required');
  }

  if (!row.email.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
    errors.push('Invalid email format');
  }

  const validLanguages = ['en', 'nl', 'fr'];
  if (row.preferredLanguage && !validLanguages.includes(row.preferredLanguage.toLowerCase())) {
    errors.push('Unsupported language (use en, nl, or fr)');
  }

  return {
    ...row,
    errors,
    isValid: errors.length === 0,
  };
}

/**
 * Detect and mark duplicate emails within the batch
 */
export function detectDuplicateEmails(rows: ImportGuestRow[]): ImportGuestRow[] {
  const seen = new Map<string, number>();

  return rows.map((row) => {
    if (!row.email) return row;

    const emailLower = row.email.toLowerCase();
    const firstIndex = seen.get(emailLower);

    if (firstIndex !== undefined) {
      return {
        ...row,
        errors: [...row.errors, `Duplicate email (same as row ${firstIndex + 1})`],
        isValid: false,
      };
    }

    seen.set(emailLower, row.rowIndex);
    return row;
  });
}

/**
 * Mark rows whose email already exists in the database
 */
export function markExistingEmails(rows: ImportGuestRow[], existingEmails: string[]): ImportGuestRow[] {
  const existingSet = new Set(existingEmails.map((e) => e.toLowerCase()));

  return rows.map((row) => {
    if (!row.email || !existingSet.has(row.email.toLowerCase())) return row;

    return {
      ...row,
      errors: [...row.errors, 'Email already exists in guest list'],
      isValid: false,
    };
  });
}

/**
 * Generate and download a template .xlsx file
 */
export function generateTemplate() {
  const headers = ['Name', 'Email', 'RSVP Status', 'Preferred Language'];
  const exampleRow = ['John Doe', 'john@example.com', 'Pending', 'en'];

  const ws = XLSX.utils.aoa_to_sheet([headers, exampleRow]);

  // Set column widths
  ws['!cols'] = [
    { wch: 25 },
    { wch: 30 },
    { wch: 15 },
    { wch: 20 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Guests');
  XLSX.writeFile(wb, 'guest-import-template.xlsx');
}
