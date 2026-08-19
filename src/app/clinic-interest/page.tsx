import type { Metadata } from "next";
import { ClinicInterestForm } from "@/components/clinic-interest/ClinicInterestForm";

export const metadata: Metadata = {
  title: "Register your clinic's interest — Natalyx",
  description:
    "Fertility clinics can register interest in Natalyx, the coordination layer for known-surrogate journeys. Four details, no patient information.",
  robots: { index: false, follow: false },
};

export default function ClinicInterestPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--color-cream)_0%,#ffffff_50%,var(--color-green-soft)_100%)] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10">
            <h1 className="mb-4 font-serif text-4xl font-medium text-navy md:text-5xl">
              Register your clinic&apos;s interest.
            </h1>
            <p className="leading-relaxed text-navy-light">
              Natalyx is not generally available yet. Tell us how to reach your
              clinic and we will get in touch as we introduce it to new
              practices. This is a record of interest, not an application, and
              nothing here is a clinical, legal, or eligibility decision.
            </p>
          </div>

          <div className="rounded-lg border border-line bg-white p-8 shadow-sm md:p-10">
            <ClinicInterestForm />
          </div>
        </div>
      </div>
    </div>
  );
}
