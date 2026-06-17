import type { Metadata } from "next";
import { SignupForm } from "@/components/signup/SignupForm";

export const metadata: Metadata = {
  title: "Register Interest — Natalyx",
  description:
    "Register your interest in Natalyx for gestational surrogacy, IVF, donor conception, donation, and coordinated fertility support.",
  robots: { index: false, follow: false },
};

const allowedRoles = new Set([
  "intended_parent",
  "gestational_surrogate",
  "donor",
  "not_sure",
]);

type SignupPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};
  const rawRole = Array.isArray(params.role) ? params.role[0] : params.role;
  const initialRole = rawRole && allowedRoles.has(rawRole) ? rawRole : "";

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,var(--color-cream)_0%,#ffffff_50%,var(--color-green-soft)_100%)] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-medium font-serif text-navy mb-4">
              Let&apos;s connect.
            </h1>
            <p className="text-navy-light leading-relaxed">
              Natalyx is not publicly available yet. Share a few general
              details so we can understand your starting point and reach out as
              access opens. This is not a medical, legal, or clinical
              eligibility decision. Please avoid medical, legal, financial, or
              confidential case details here.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-line shadow-sm p-8 md:p-10">
            <SignupForm initialRole={initialRole} />
          </div>
        </div>
      </div>
    </div>
  );
}
