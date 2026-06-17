import { ScrollReveal } from "@/components/ui/ScrollReveal";

const steps = [
  {
    label: "Human-first matching support",
    body: "Compatibility is not only medical. Natalyx helps intended parents and gestational carriers understand values, communication style, expectations, and the kind of relationship each person hopes to have.",
  },
  {
    label: "Transparent journey tracking",
    body: "See the major phases, milestones, documents, and next steps in one place, so the process feels less opaque.",
  },
  {
    label: "Clearer costs and fewer surprises",
    body: "Natalyx is designed to make costs, responsibilities, and timing easier to understand before people commit to the next stage.",
  },
  {
    label: "Privacy by design",
    body: "Sensitive information should move carefully. Natalyx protects privacy while helping people share what matters at the right time.",
  },
  {
    label: "Built beyond one pathway",
    body: "We are starting with gestational surrogacy, but Natalyx is designed for the wider ART journey, including IVF, donor conception, and partner-supported care.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="support"
      aria-labelledby="support-heading"
      className="border-y border-line bg-cream-deep py-20"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto mb-11 max-w-[640px] text-center">
          <ScrollReveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-accent-deep">
              What Makes Us Different
            </p>
            <h2
              id="support-heading"
              className="mx-auto mb-3 max-w-[620px] font-serif text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl"
            >
              A platform built for the people who need it.
            </h2>
            <p className="mx-auto max-w-[640px] text-base leading-7 text-navy-light">
              Built around clearer coordination, more thoughtful support, and
              fewer opaque handoffs.
            </p>
          </ScrollReveal>
        </div>

        <div className="relative mx-auto grid max-w-[1040px] grid-cols-1 gap-8 md:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-line-strong md:block" />
          {steps.map((step, index) => (
            <ScrollReveal key={step.label} delay={index * 90}>
              <article className="relative z-10 flex flex-col items-center gap-3 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-orange/25 bg-cream text-lg font-bold text-brand-orange shadow-[0_4px_14px_rgba(31,26,20,0.06)]">
                  0{index + 1}
                </span>
                <h3 className="text-base font-serif font-semibold text-navy">{step.label}</h3>
                <p className="max-w-[250px] text-sm leading-6 text-navy-light">
                  {step.body}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
