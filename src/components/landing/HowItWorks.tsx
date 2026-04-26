import { ScrollReveal } from "@/components/ui/ScrollReveal";

const steps = [
  {
    label: "Register interest",
    body: "Choose the role or pathway that best describes where you are starting.",
  },
  {
    label: "Share your starting context",
    body: "Answer a few early questions so Natalyx can understand whether you are exploring surrogacy, IVF, donor conception, donation, or something less defined.",
  },
  {
    label: "Receive the right route",
    body: "As access opens, Natalyx can guide users toward the most relevant next step: education, intake, profile-building, partner support, or review.",
  },
  {
    label: "Move into a structured journey",
    body: "Once invited, users can begin more detailed intake, profile creation, milestone tracking, and coordinated support inside Natalyx.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="support"
      aria-labelledby="support-heading"
      className="border-y border-gray-100 bg-white py-20"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto mb-11 max-w-[640px] text-center">
          <ScrollReveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-[#ec4899]">
              What to Expect
            </p>
            <h2
              id="support-heading"
              className="mx-auto mb-3 max-w-[620px] text-[1.9rem] font-bold leading-tight text-navy"
            >
              Your path from interest to the right next step.
            </h2>
            <p className="mx-auto max-w-[640px] text-base leading-7 text-gray-500">
              Natalyx is opening carefully. For now, you can register interest,
              tell us which path brings you here, and help us understand where
              you may fit as access becomes available.
            </p>
          </ScrollReveal>
        </div>

        <div className="relative mx-auto grid max-w-[1000px] grid-cols-1 gap-6 md:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-8 hidden h-0.5 bg-gradient-to-r from-[#c7d2fe] to-[#fbcfe8] md:block" />
          {steps.map((step, index) => (
            <ScrollReveal key={step.label} delay={index * 90}>
              <article className="relative z-10 flex flex-col items-center gap-3 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c7d2fe] bg-white text-xl font-bold text-primary shadow-[0_4px_14px_rgba(99,102,241,0.15)] transition duration-150 group-hover:-translate-y-1">
                  {index + 1}
                </span>
                <h3 className="text-base font-bold text-navy">{step.label}</h3>
                <p className="max-w-[250px] text-sm leading-6 text-gray-600">
                  {step.body}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={280}>
          <div className="mx-auto mt-10 max-w-[720px] rounded-xl border border-dashed border-[#c7d2fe] bg-gradient-to-br from-primary/5 to-[#ec4899]/5 px-6 py-5 text-center text-sm leading-6 text-gray-600">
            This is an early interest step, not a medical, legal, or clinical
            eligibility decision. Please do not provide confidential medical,
            legal, or financial details yet.
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
