export const ROLE_OPTIONS = [
  { value: "intended_parent", label: "I want help as an intended parent" },
  { value: "gestational_surrogate", label: "I want to learn about becoming a gestational carrier" },
  { value: "donor", label: "I want to ask about donor pathways" },
  { value: "not_sure", label: "I have a general enquiry" },
] as const;

export const JOURNEY_STAGE_OPTIONS = [
  { value: "just_exploring", label: "Just exploring" },
  { value: "already_started", label: "I have already started" },
  { value: "have_clinic_or_lawyer", label: "I already have a clinic, lawyer, or support team" },
  { value: "know_other_party", label: "I already know the other party" },
  { value: "questions_first", label: "I have questions before I decide" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const;

export const PREFERRED_CONTACT_OPTIONS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "either", label: "Either is fine" },
] as const;

export const NOTES_MAX_LENGTH = 1000;

export const DEVELOPER_ACCESS_URL =
  process.env.NEXT_PUBLIC_DEVELOPER_ACCESS_URL ??
  "https://dev.app.natalyx.health/login";
