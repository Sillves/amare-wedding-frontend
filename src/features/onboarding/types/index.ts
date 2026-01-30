import { z } from 'zod';

export const wizardSchema = z.object({
  // Step 2: Wedding Details
  title: z.string().min(1, 'weddings:wizard.validation.titleRequired'),
  date: z.date().optional(),
  dateNotDecided: z.boolean().default(false),

  // Step 3: Partner Names
  partner1Name: z.string().min(1, 'weddings:wizard.validation.partner1Required'),
  partner2Name: z.string().min(1, 'weddings:wizard.validation.partner2Required'),

  // Step 4: Location
  location: z.string().optional(),

  // Step 5: First Guest
  firstGuestName: z.string().optional(),
  firstGuestEmail: z
    .string()
    .email('weddings:wizard.validation.emailInvalid')
    .optional()
    .or(z.literal('')),
});

export type WizardFormData = z.infer<typeof wizardSchema>;

export interface WizardStep {
  id: number;
  key: string;
  labelKey: string;
  optional: boolean;
}

export const WIZARD_STEPS: WizardStep[] = [
  { id: 1, key: 'welcome', labelKey: 'weddings:wizard.steps.welcome', optional: false },
  { id: 2, key: 'details', labelKey: 'weddings:wizard.steps.details', optional: false },
  { id: 3, key: 'partners', labelKey: 'weddings:wizard.steps.partners', optional: false },
  { id: 4, key: 'location', labelKey: 'weddings:wizard.steps.location', optional: true },
  { id: 5, key: 'guest', labelKey: 'weddings:wizard.steps.guest', optional: true },
  { id: 6, key: 'complete', labelKey: 'weddings:wizard.steps.complete', optional: false },
];

export const STEP_FIELDS: Record<number, (keyof WizardFormData)[]> = {
  1: [], // Welcome - no validation
  2: ['title'], // Details (date is optional)
  3: ['partner1Name', 'partner2Name'], // Partners
  4: [], // Location (optional)
  5: [], // Guest (optional)
  6: [], // Complete - no validation
};
