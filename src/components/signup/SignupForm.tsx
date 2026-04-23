"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FormSuccess } from "./FormSuccess";
import {
  JOURNEY_STAGE_OPTIONS,
  NOTES_MAX_LENGTH,
  PREFERRED_CONTACT_OPTIONS,
  ROLE_OPTIONS,
} from "@/lib/constants";

interface FormState {
  role: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  journey_stage: string;
  preferred_contact: string;
  notes: string;
  consent_to_contact: boolean;
  // Honeypot: always empty for real users.
  website_url: string;
}

interface FieldErrors {
  [key: string]: string | undefined;
}

const initialForm: FormState = {
  role: "",
  name: "",
  email: "",
  phone: "",
  country: "United States",
  region: "",
  journey_stage: "",
  preferred_contact: "email",
  notes: "",
  consent_to_contact: false,
  website_url: "",
};

type SignupFormProps = {
  initialRole?: string;
};

export function SignupForm({ initialRole = "" }: SignupFormProps) {
  const [form, setForm] = useState<FormState>(() => ({
    ...initialForm,
    role: initialRole,
  }));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const honeypotId = useId();

  if (submitted) {
    return <FormSuccess alreadyRegistered={alreadyRegistered} />;
  }

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function clientValidate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!form.role) errs.role = "Please choose the option that best describes you";
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (form.notes.length > NOTES_MAX_LENGTH) {
      errs.notes = `Notes must be under ${NOTES_MAX_LENGTH} characters`;
    }
    if (!form.consent_to_contact) {
      errs.consent_to_contact = "Please confirm we may contact you";
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const clientErrors = clientValidate();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      const firstKey = Object.keys(clientErrors)[0];
      const el = document.getElementById(firstKey);
      el?.focus();
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          journey_stage: form.journey_stage || undefined,
          preferred_contact: form.preferred_contact || undefined,
        }),
      });

      const data = (await res.json()) as {
        success: boolean;
        duplicate?: boolean;
        error?: string;
        errors?: Record<string, string[]>;
      };

      if (res.status === 201 || res.ok) {
        setAlreadyRegistered(!!data.duplicate);
        setSubmitted(true);
        return;
      }

      if (data.errors) {
        const fieldErrors: FieldErrors = {};
        for (const [key, msgs] of Object.entries(data.errors)) {
          fieldErrors[key] = msgs[0];
        }
        setErrors(fieldErrors);
        const firstKey = Object.keys(fieldErrors)[0];
        const el = document.getElementById(firstKey);
        el?.focus();
      } else if (data.error) {
        setServerError(data.error);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } catch {
      setServerError(
        "Unable to submit. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Natalyx interest registration">
      {serverError && (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <fieldset className="mb-8">
        <legend className="mb-6 w-full border-b border-cyan-100 pb-3 text-base font-semibold text-navy">
          Start with what fits today
        </legend>
        <div className="grid grid-cols-1 gap-5">
          <Select
            id="role"
            label="Which best describes you?"
            required
            placeholder="Choose one"
            options={ROLE_OPTIONS as unknown as { value: string; label: string }[]}
            value={form.role}
            onChange={(e) => setField("role", e.target.value)}
            error={errors.role}
          />
          <Select
            id="journey_stage"
            label="Where are you in the journey?"
            placeholder="Choose one"
            options={JOURNEY_STAGE_OPTIONS as unknown as { value: string; label: string }[]}
            value={form.journey_stage}
            onChange={(e) => setField("journey_stage", e.target.value)}
            error={errors.journey_stage}
          />
        </div>
      </fieldset>

      <fieldset className="mb-8">
        <legend className="mb-6 w-full border-b border-cyan-100 pb-3 text-base font-semibold text-navy">
          Your details
        </legend>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="name"
            label="Name"
            required
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            error={errors.name}
            placeholder="Jane Smith"
            autoComplete="name"
          />
          <Input
            id="email"
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setField("email", e.target.value)}
            error={errors.email}
            placeholder="jane@example.com"
            autoComplete="email"
          />
          <Input
            id="phone"
            label="Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setField("phone", e.target.value)}
            error={errors.phone}
            placeholder="+1 (555) 000-0000"
            autoComplete="tel"
          />
          <Select
            id="preferred_contact"
            label="Preferred contact"
            options={PREFERRED_CONTACT_OPTIONS as unknown as { value: string; label: string }[]}
            value={form.preferred_contact}
            onChange={(e) => setField("preferred_contact", e.target.value)}
            error={errors.preferred_contact}
          />
          <Input
            id="country"
            label="Country"
            value={form.country}
            onChange={(e) => setField("country", e.target.value)}
            error={errors.country}
            placeholder="United States"
            autoComplete="country-name"
          />
          <Input
            id="region"
            label="State / Region"
            value={form.region}
            onChange={(e) => setField("region", e.target.value)}
            error={errors.region}
            placeholder="California"
            autoComplete="address-level1"
          />
        </div>
      </fieldset>

      <fieldset className="mb-8">
        <legend className="mb-6 w-full border-b border-cyan-100 pb-3 text-base font-semibold text-navy">
          Anything you want us to know
        </legend>
        <Textarea
          id="notes"
          label="Notes"
          value={form.notes}
          onChange={(e) => setField("notes", e.target.value)}
          error={errors.notes}
          placeholder="A short note is optional. Please keep it general."
          maxLength={NOTES_MAX_LENGTH}
          showCharCount
          currentLength={form.notes.length}
        />
        <p className="mt-2 text-xs leading-relaxed text-gray-500">
          Please do not include medical, legal, financial, or confidential case
          details in this form.
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
              aria-describedby={errors.consent_to_contact ? "consent_to_contact-err" : undefined}
            />
            <div className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-white transition-colors group-hover:border-primary peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2">
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
              Natalyx may contact me about early access.
            </span>
            <p className="mt-0.5 text-xs text-gray-500">
              No commitment. Natalyx does not provide medical, legal, insurance,
              psychological, or eligibility clearance through this form.
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
          className="w-full sm:w-auto"
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
            "Register interest"
          )}
        </Button>
        <p className="mt-3 text-xs text-gray-400">
          We are not publicly available yet. This simply lets us know you would
          like to hear from us.
        </p>
      </div>
    </form>
  );
}
