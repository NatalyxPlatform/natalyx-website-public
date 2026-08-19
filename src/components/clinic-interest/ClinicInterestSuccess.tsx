import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/constants";

/**
 * Confirms receipt only. It deliberately does not echo the submitted clinic
 * name, email, or phone number, and promises no acceptance, onboarding,
 * partnership, or response time.
 */
export function ClinicInterestSuccess() {
  return (
    <div className="px-6 py-16 text-center" role="status" aria-live="polite">
      <div className="mb-8 flex justify-center" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/natalyx_combined_icon.png" alt="" className="h-24 w-auto" />
      </div>

      <h2 className="mb-4 font-serif text-3xl font-medium text-navy">
        We have your clinic&apos;s interest.
      </h2>
      <p className="mx-auto mb-8 max-w-md leading-relaxed text-navy-light">
        Thank you. Your registration has been recorded. Natalyx is being
        introduced to clinics gradually. This records your clinic&apos;s
        interest; it is not an application, and not a decision about working
        together.
      </p>
      <p className="mb-10 text-sm text-navy-light/70">
        If you need to reach us in the meantime, write to{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-primary transition-colors hover:text-primary-dark"
        >
          {CONTACT_EMAIL}
        </a>
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded text-sm font-medium text-primary transition-colors hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Back to homepage
      </Link>
    </div>
  );
}
