export const ROLE_OPTIONS = [
  { value: "intended_parent", label: "I am an intended parent" },
  { value: "gestational_surrogate", label: "I am considering becoming a gestational carrier" },
  { value: "donor", label: "I am interested in being a donor" },
  { value: "not_sure", label: "I am not sure yet" },
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
