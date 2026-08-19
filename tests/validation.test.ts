import { describe, expect, it } from "vitest";
import {
  clinicInterestSchema,
  normalizeEmail,
  normalizePhone,
  PHONE_MAX_DIGITS,
  PHONE_MIN_DIGITS,
} from "@/lib/validation";

const validSubmission = {
  clinic_name: "Bayview Fertility Center",
  contact_name: "Dana Reyes",
  work_email: "dana.reyes@bayviewfertility.example",
  phone: "+1 415 555 0142",
  consent_to_contact: true as const,
  website_url: "",
};

function fieldErrors(input: unknown): Record<string, string[] | undefined> {
  const result = clinicInterestSchema.safeParse(input);
  if (result.success) return {};
  return result.error.flatten().fieldErrors;
}

describe("clinicInterestSchema — the four clinic fields", () => {
  it("accepts a complete clinic submission", () => {
    const result = clinicInterestSchema.safeParse(validSubmission);
    expect(result.success).toBe(true);
  });

  it.each([
    ["clinic_name", "Clinic name is required"],
    ["contact_name", "Your name is required"],
    ["work_email", "Work email is required"],
    ["phone", "Phone number is required"],
  ])("refuses a submission missing %s", (field, message) => {
    const errors = fieldErrors({ ...validSubmission, [field]: "" });
    expect(errors[field]?.[0]).toBe(message);
  });

  it("refuses a submission with every field blank, naming all four", () => {
    const errors = fieldErrors({
      clinic_name: "",
      contact_name: "",
      work_email: "",
      phone: "",
      consent_to_contact: false,
    });
    expect(Object.keys(errors).sort()).toEqual([
      "clinic_name",
      "consent_to_contact",
      "contact_name",
      "phone",
      "work_email",
    ]);
  });

  it("requires explicit consent to contact", () => {
    const errors = fieldErrors({
      ...validSubmission,
      consent_to_contact: false,
    });
    expect(errors.consent_to_contact?.[0]).toBe(
      "Please confirm we may contact your clinic"
    );
  });
});

describe("clinicInterestSchema — email", () => {
  it.each(["nope", "a@b", "no spaces@example.com", "@example.com", "a@"])(
    "refuses %j",
    (candidate) => {
      const errors = fieldErrors({ ...validSubmission, work_email: candidate });
      expect(errors.work_email?.[0]).toBe("Enter a valid work email address");
    }
  );

  it("normalizes case and surrounding whitespace only", () => {
    const result = clinicInterestSchema.safeParse({
      ...validSubmission,
      work_email: "  Dana.Reyes@BayviewFertility.example  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.work_email).toBe("dana.reyes@bayviewfertility.example");
    }
  });

  it("normalizeEmail does not alter the address beyond case and trim", () => {
    expect(normalizeEmail(" A.B+tag@Example.COM ")).toBe("a.b+tag@example.com");
  });
});

describe("clinicInterestSchema — phone", () => {
  it.each(["12", "555 12", "1"])("refuses too-few-digits %j", (candidate) => {
    const errors = fieldErrors({ ...validSubmission, phone: candidate });
    expect(errors.phone?.[0]).toBe(
      `Enter a phone number with ${PHONE_MIN_DIGITS} to ${PHONE_MAX_DIGITS} digits`
    );
  });

  it("refuses more than the E.164 maximum of 15 digits", () => {
    const errors = fieldErrors({
      ...validSubmission,
      phone: "1234567890123456",
    });
    expect(errors.phone?.[0]).toBe(
      `Enter a phone number with ${PHONE_MIN_DIGITS} to ${PHONE_MAX_DIGITS} digits`
    );
  });

  it.each(["abc", "call me", "415-555-0142 ext. two"])(
    "refuses non-numeric %j",
    (candidate) => {
      const errors = fieldErrors({ ...validSubmission, phone: candidate });
      expect(errors.phone?.[0]).toBe(
        "Enter a phone number using digits and + ( ) - . only"
      );
    }
  );

  it.each(["+1 415 555 0142", "(415) 555-0142", "415.555.0142", "4155550142"])(
    "accepts commonly typed format %j",
    (candidate) => {
      const result = clinicInterestSchema.safeParse({
        ...validSubmission,
        phone: candidate,
      });
      expect(result.success).toBe(true);
    }
  );

  it("normalizes formatting only, keeping a leading plus", () => {
    expect(normalizePhone("+1 (415) 555-0142")).toBe("+14155550142");
    expect(normalizePhone("(415) 555-0142")).toBe("4155550142");
  });
});

describe("clinicInterestSchema — retired participant fields", () => {
  it("strips a role field instead of accepting it", () => {
    const result = clinicInterestSchema.safeParse({
      ...validSubmission,
      role: "intended_parent",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("role");
    }
  });

  it.each([
    "role",
    "role_value",
    "journey_stage",
    "preferred_contact",
    "notes",
    "country",
    "region",
  ])("strips retired participant field %s", (field) => {
    const result = clinicInterestSchema.safeParse({
      ...validSubmission,
      [field]: "gestational_surrogate",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(Object.keys(result.data)).not.toContain(field);
    }
  });

  it("exposes no participant role enum on the schema shape", () => {
    expect(Object.keys(clinicInterestSchema.shape).sort()).toEqual([
      "clinic_name",
      "consent_to_contact",
      "contact_name",
      "phone",
      "website_url",
      "work_email",
    ]);
  });
});
