import type { Metadata } from "next";
import { SignupForm } from "@/components/signup/SignupForm";

export const metadata: Metadata = {
  title: "Register Interest — Natalyx",
  description:
    "Register your interest in Natalyx for fertility and parenthood journeys.",
  robots: { index: false, follow: false },
};

const allowedRoles = new Set([
  "intended_parent",
  "gestational_surrogate",
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#F2FBFD_0%,#FFFFFF_42%,#F7FCF9_100%)] py-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10">
            <p className="mb-4 text-sm font-medium uppercase text-primary">
              Early access
            </p>
            <h1 className="text-4xl md:text-5xl font-light text-navy mb-4">
              Tell us where you are starting.
            </h1>
            <p className="text-gray-500 leading-relaxed">
              Natalyx is not publicly available yet. Share a few general details,
              and we will reach out when there is a thoughtful next step for your
              journey. Please avoid medical, legal, financial, or confidential
              case details here.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-cyan-100 shadow-sm p-8 md:p-10">
            <SignupForm initialRole={initialRole} />
          </div>
        </div>
      </div>
    </div>
  );
}
