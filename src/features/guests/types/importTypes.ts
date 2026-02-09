import type { RsvpStatus } from '@/features/weddings/types';

export interface ImportGuestRow {
  rowIndex: number;
  name: string;
  email: string;
  rsvpStatus: RsvpStatus;
  preferredLanguage: string;
  errors: string[];
  isValid: boolean;
}

export interface ColumnMapping {
  sourceColumn: string;
  targetField: 'name' | 'email' | 'rsvpStatus' | 'preferredLanguage' | 'skip';
}

export interface BulkImportGuestRequest {
  guests: {
    name: string;
    email: string;
    rsvpStatus: RsvpStatus;
    preferredLanguage?: string;
  }[];
}

export interface BulkImportGuestResult {
  createdCount: number;
  skippedCount: number;
  errorCount: number;
  createdGuests: { id: string; name: string; email: string }[];
  errors: BulkImportGuestError[];
}

export interface BulkImportGuestError {
  rowIndex: number;
  name: string;
  email: string;
  errorMessage: string;
}

export type ImportStep = 'upload' | 'mapping' | 'preview' | 'result';
