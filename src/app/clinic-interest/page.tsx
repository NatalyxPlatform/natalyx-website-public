import type { Metadata } from "next";
import { ClinicInterestForm } from "@/components/clinic-interest/ClinicInterestForm";
import {
  CLINIC_INTEREST_DESCRIPTION,
  CLINIC_INTEREST_TITLE,
} from "@/lib/positioning";

export const metadata: Metadata = {
  title: CLINIC_INTEREST_TITLE,
  description: CLINIC_INTEREST_DESCRIPTION,
  robots: { index: false, follow: false },
};

export default function ClinicInterestPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--color-cream)_0%,#ffffff_50%,var(--color-green-soft)_100%)] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10">
            <h1 className="mb-4 text-4xl font-medium text-navy md:text-5xl">
              Register your clinic&apos;s interest.
            </h1>
            <p className="leading-relaxed text-navy-light">
              Natalyx is the operational layer for the surrogacy journeys your
              clinic already runs. It is not generally available yet — tell us
              how to reach your clinic and we will get in touch as we introduce
              it to new practices. This is a record of interest, not an
              application, and nothing here is a clinical, legal, or
              eligibility decision.
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
