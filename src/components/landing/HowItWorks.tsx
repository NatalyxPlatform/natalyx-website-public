import { ScrollReveal } from "@/components/ui/ScrollReveal";

const steps = [
  {
    label: "Shared journey context",
    body: "Intended parents, the gestational carrier, and clinic staff see one consistent view of where the journey stands, scoped to what each of them should see.",
  },
  {
    label: "Participant preparation",
    body: "Natalyx carries the explaining and the chasing that comes before a clinical step, so participants arrive prepared and coordinators repeat themselves less.",
  },
  {
    label: "Provider handoffs",
    body: "Handoffs to and from outside professionals carry their context with them. Those professionals keep their own judgment and their own decisions.",
  },
  {
    label: "Records and appointments",
    body: "Outstanding records and unscheduled appointments surface as shared, trackable work instead of living in one coordinator's inbox.",
  },
  {
    label: "Clinic-branded where it counts",
    body: "Participant-facing coordination can carry the clinic's name, so the journey still feels like it belongs to the practice running it.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="border-y border-line bg-cream-deep py-20"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto mb-11 max-w-[640px] text-center">
          <ScrollReveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-accent-deep">
              What Natalyx Takes On
            </p>
            <h2
              id="how-it-works-heading"
              className="mx-auto mb-3 max-w-[620px] font-serif text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl"
            >
              The administrative weight around a journey, not the clinical
              judgment inside it.
            </h2>
            <p className="mx-auto max-w-[640px] text-base leading-7 text-navy-light">
              Clinics and their providers stay authoritative. Natalyx organizes
              the coordination that surrounds their decisions.
            </p>
          </ScrollReveal>
        </div>

        <ul className="relative mx-auto grid max-w-[1040px] list-none grid-cols-1 gap-8 md:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-8 hidden h-px bg-line-strong md:block" />
          {steps.map((step, index) => (
            <li key={step.label}>
              <ScrollReveal delay={index * 90}>
                <article className="relative z-10 flex flex-col items-center gap-3 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-brand-orange/25 bg-cream text-lg font-bold text-brand-orange shadow-[0_4px_14px_rgba(31,26,20,0.06)]">
                    0{index + 1}
                  </span>
                  <h3 className="font-serif text-base font-semibold text-navy">
                    {step.label}
                  </h3>
                  <p className="max-w-[250px] text-sm leading-6 text-navy-light">
                    {step.body}
                  </p>
                </article>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
