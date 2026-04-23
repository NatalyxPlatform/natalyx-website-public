import { z } from "zod";
import { NOTES_MAX_LENGTH } from "./constants";

export const leadFormSchema = z.object({
  role: z.enum(["intended_parent", "gestational_surrogate", "not_sure"], {
    required_error: "Please choose the option that best describes you",
  }),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .transform((v) => v.toLowerCase()),
  phone: z.string().trim().max(30, "Phone number is too long").optional().or(z.literal("")),
  country: z.string().trim().max(100, "Country name is too long").optional().or(z.literal("")),
  region: z.string().trim().max(100, "State or region is too long").optional().or(z.literal("")),
  journey_stage: z
    .enum([
      "just_exploring",
      "already_started",
      "have_clinic_or_lawyer",
      "know_other_party",
      "questions_first",
      "prefer_not_to_say",
    ])
    .optional()
    .or(z.literal("")),
  preferred_contact: z
    .enum(["email", "phone", "either"])
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .trim()
    .max(NOTES_MAX_LENGTH, `Notes must be under ${NOTES_MAX_LENGTH} characters`)
    .optional()
    .or(z.literal("")),
  consent_to_contact: z.literal(true, {
    errorMap: () => ({ message: "Please confirm we may contact you" }),
  }),

  // Honeypot: must be empty.
  website_url: z.string().max(0).optional(),
});

export type LeadFormInput = z.input<typeof leadFormSchema>;
export type LeadFormOutput = z.output<typeof leadFormSchema>;
