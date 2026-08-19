"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ClinicInterestSuccess } from "./ClinicInterestSuccess";
import { CLINIC_INTEREST_ENDPOINT } from "@/lib/constants";
import {
  CLINIC_INTEREST_FIELDS,
  clinicInterestSchema,
  PHONE_MAX_LENGTH,
} from "@/lib/validation";

type FieldErrors = Record<string, string | undefined>;

type FormState = {
  clinic_name: string;
  contact_name: string;
  work_email: string;
  phone: string;
  consent_to_contact: boolean;
  /** Honeypot: always empty for real users. */
  website_url: string;
};

const initialForm: FormState = {
  clinic_name: "",
  contact_name: "",
  work_email: "",
  phone: "",
  consent_to_contact: false,
  website_url: "",
};

/** Order used to decide which invalid field receives focus. */
const FOCUS_ORDER: string[] = [...CLINIC_INTEREST_FIELDS, "consent_to_contact"];

const GENERIC_FAILURE =
  "We could not record your request just now. Please try again in a moment.";

export function ClinicInterestForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const honeypotId = useId();

  if (submitted) {
    return <ClinicInterestSuccess />;
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function focusFirstError(fieldErrors: FieldErrors) {
    const first =
      FOCUS_ORDER.find((field) => fieldErrors[field]) ??
      Object.keys(fieldErrors)[0];
    if (first) document.getElementById(first)?.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);

    // The same schema the route uses, so client and server never drift.
    const parsed = clinicInterestSchema.safeParse(form);
    if (!parsed.success) {
      const flattened = parsed.error.flatten().fieldErrors;
      const fieldErrors: FieldErrors = {};
      for (const [field, messages] of Object.entries(flattened)) {
        if (messages && messages.length > 0) fieldErrors[field] = messages[0];
      }
      setErrors(fieldErrors);
      focusFirstError(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(CLINIC_INTEREST_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      } | null;

      // Success renders only on an explicit affirmative response.
      if (response.ok && data?.ok === true) {
        setSubmitted(true);
        return;
      }

      if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
        setErrors(data.fieldErrors);
        focusFirstError(data.fieldErrors);
        setServerError(data.error ?? GENERIC_FAILURE);
        return;
      }

      setServerError(data?.error ?? GENERIC_FAILURE);
    } catch {
      setServerError(
        "Unable to submit. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={"Register your clinic's interest"}
    >
      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <fieldset className="mb-8">
        <legend className="mb-6 w-full border-b border-line pb-3 text-base font-semibold font-serif text-navy">
          Your clinic
        </legend>
        <Input
          id="clinic_name"
          label="Clinic name"
          required
          autoComplete="organization"
          value={form.clinic_name}
          onChange={(e) => setField("clinic_name", e.target.value)}
          error={errors.clinic_name}
        />
      </fieldset>

      <fieldset className="mb-8">
        <legend className="mb-6 w-full border-b border-line pb-3 text-base font-semibold font-serif text-navy">
          Who we should speak to
        </legend>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="contact_name"
            label="Your name"
            required
            autoComplete="name"
            value={form.contact_name}
            onChange={(e) => setField("contact_name", e.target.value)}
            error={errors.contact_name}
          />
          <Input
            id="work_email"
            label="Work email"
            type="email"
            required
            autoComplete="email"
            value={form.work_email}
            onChange={(e) => setField("work_email", e.target.value)}
            error={errors.work_email}
          />
          <Input
            id="phone"
            label="Phone number"
            type="tel"
            required
            autoComplete="tel"
            maxLength={PHONE_MAX_LENGTH}
            description="Include the country or area code, for example +1 415 555 0142."
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            error={errors.phone}
          />
        </div>
        <p className="mt-4 text-xs leading-relaxed text-navy-light/80">
          These four details are all we need. Please do not include patient,
          medical, legal, or case information in this form.
        </p>
      </fieldset>

      <div className="mb-8">
        <label className="group flex cursor-pointer items-start gap-3">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              id="consent_to_contact"
              checked={form.consent_to_contact}
              onChange={(e) => setField("consent_to_contact", e.target.checked)}
              className="peer sr-only"
              aria-describedby={
                errors.consent_to_contact ? "consent_to_contact-err" : undefined
              }
            />
            <div className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white transition-colors group-hover:border-accent-deep peer-checked:border-accent-deep peer-checked:bg-accent-deep peer-focus-visible:ring-2 peer-focus-visible:ring-accent-deep peer-focus-visible:ring-offset-2">
              {form.consent_to_contact && (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </div>
          </div>
          <div>
            <span className="text-sm font-medium text-navy">
              Natalyx may contact our clinic about this request.
            </span>
            <p className="mt-0.5 text-xs text-navy-light/80">
              Registering interest is not an application, and creates no
              agreement or obligation for your clinic.
            </p>
            {errors.consent_to_contact && (
              <p
                id="consent_to_contact-err"
                className="mt-1 text-xs text-red-500"
                role="alert"
              >
                {errors.consent_to_contact}
              </p>
            )}
          </div>
        </label>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor={honeypotId}>Website URL</label>
        <input
          id={honeypotId}
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website_url}
          onChange={(e) => setField("website_url", e.target.value)}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          aria-busy={submitting}
          className="w-full !bg-brand-orange !text-white hover:!bg-brand-orange-dark hover:shadow-[0_8px_22px_rgba(244,152,88,0.28)] focus-visible:ring-brand-orange sm:w-auto"
        >
          {submitting ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            <>Register your clinic&apos;s interest</>
          )}
        </Button>
      </div>
    </form>
  );
}
