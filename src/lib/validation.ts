import { z } from "zod";

export const CLINIC_NAME_MAX_LENGTH = 200;
export const CONTACT_NAME_MAX_LENGTH = 200;
export const EMAIL_MAX_LENGTH = 254;
export const PHONE_MAX_LENGTH = 40;
export const PHONE_MIN_DIGITS = 7;
export const PHONE_MAX_DIGITS = 15;

/** Digits, spaces and the punctuation people actually type in phone numbers. */
const PHONE_ALLOWED_CHARACTERS = /^[0-9+()\-.\s]+$/;

export const PHONE_CHARACTER_MESSAGE =
  "Enter a phone number using digits and + ( ) - . only";
export const PHONE_LENGTH_MESSAGE = `Enter a phone number with ${PHONE_MIN_DIGITS} to ${PHONE_MAX_DIGITS} digits`;

export function countPhoneDigits(value: string): number {
  return value.replace(/\D/g, "").length;
}

/**
 * Formatting-only normalization: collapses a typed number to digits, keeping a
 * leading `+` when one was given. This does not verify that the number exists
 * or that the submitter owns it, and no copy may imply that it does.
 */
export function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

/** Formatting-only normalization. Does not verify the mailbox exists. */
export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export const clinicInterestSchema = z.object({
  clinic_name: z
    .string()
    .trim()
    .min(1, "Clinic name is required")
    .max(CLINIC_NAME_MAX_LENGTH, "Clinic name is too long"),
  contact_name: z
    .string()
    .trim()
    .min(1, "Your name is required")
    .max(CONTACT_NAME_MAX_LENGTH, "Name is too long"),
  work_email: z
    .string()
    .trim()
    .min(1, "Work email is required")
    .max(EMAIL_MAX_LENGTH, "Email address is too long")
    .email("Enter a valid work email address")
    .transform(normalizeEmail),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(PHONE_MAX_LENGTH, "Phone number is too long")
    .refine((v) => PHONE_ALLOWED_CHARACTERS.test(v), PHONE_CHARACTER_MESSAGE)
    .refine(
      (v) =>
        countPhoneDigits(v) >= PHONE_MIN_DIGITS &&
        countPhoneDigits(v) <= PHONE_MAX_DIGITS,
      PHONE_LENGTH_MESSAGE
    ),
  consent_to_contact: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we may contact your clinic" }),
  }),

  // Honeypot: must be empty. Real submitters never see this field.
  website_url: z.string().max(0).optional(),
});

export type ClinicInterestInput = z.input<typeof clinicInterestSchema>;
export type ClinicInterestParsed = z.output<typeof clinicInterestSchema>;

/** The four fields a clinic visitor actually fills in, in form order. */
export const CLINIC_INTEREST_FIELDS = [
  "clinic_name",
  "contact_name",
  "work_email",
  "phone",
] as const;

export type ClinicInterestField = (typeof CLINIC_INTEREST_FIELDS)[number];
