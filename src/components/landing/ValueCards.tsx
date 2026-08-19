import { ScrollReveal } from "@/components/ui/ScrollReveal";

const benefits = [
  {
    title: "One coordinated journey and case context",
    body: "Participants, providers, and clinic staff work from the same picture of a journey, instead of rebuilding it from inboxes, spreadsheets, and phone calls.",
  },
  {
    title: "Less repetitive follow-up",
    body: "Preparation steps, reminders, and status chasing sit with Natalyx, so coordinators spend less time asking the same questions twice.",
  },
  {
    title: "Organized operational handoffs",
    body: "Introductions between the clinic, participants, and outside professionals carry the context they need, so less is re-explained at each step.",
  },
  {
    title: "Clearer outstanding work",
    body: "Missing records, unscheduled appointments, and unfinished preparation are visible as a shared list rather than a memory exercise.",
  },
];

const cardStyles = [
  {
    hoverBorder: "hover:border-green-deep",
    hoverBgBlob: "before:bg-green-soft/40",
    iconBg: "bg-green-soft text-green-deep",
  },
  {
    hoverBorder: "hover:border-accent-deep",
    hoverBgBlob: "before:bg-accent-soft/40",
    iconBg: "bg-accent-soft text-accent-deep",
  },
  {
    hoverBorder: "hover:border-blue",
    hoverBgBlob: "before:bg-blue-soft/40",
    iconBg: "bg-blue-soft text-blue",
  },
  {
    hoverBorder: "hover:border-line-strong",
    hoverBgBlob: "before:bg-cream-deep/40",
    iconBg: "bg-cream-deep text-navy-light",
  },
];

export function ValueCards() {
  return (
    <section
      id="for-clinics"
      aria-labelledby="for-clinics-heading"
      className="bg-paper py-[70px]"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-[760px] rounded-2xl border border-line bg-cream px-6 py-10 text-center shadow-[0_12px_30px_rgba(31,26,20,0.04)] md:px-12 md:py-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-accent-deep">
              Our Mission
            </p>
            <h2
              id="for-clinics-heading"
              className="mx-auto mb-3 max-w-[620px] font-serif text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl"
            >
              Infrastructure for the clinic, not another portal to run.
            </h2>
            <p className="mx-auto max-w-[720px] text-base leading-8 text-navy-light">
              A known-surrogate journey touches intended parents, a gestational
              carrier, clinical staff, and a set of outside professionals. Most
              of the coordination lands on the clinic, and very little of it is
              clinical work.
            </p>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-navy-light">
              Natalyx is the operational layer underneath that work.
              Known-surrogate gestational surrogacy is where we are proving it
              first; the same coordination problem runs through assisted
              reproduction more broadly.
            </p>
          </div>
        </ScrollReveal>

        <ul className="mx-auto mt-16 grid max-w-[980px] list-none grid-cols-1 gap-5 md:grid-cols-2">
          {benefits.map((benefit, index) => {
            const styles = cardStyles[index] || cardStyles[0];
            return (
              <li key={benefit.title}>
                <ScrollReveal delay={80 + index * 90}>
                  <article
                    className={`group relative block h-full overflow-hidden rounded-2xl border-2 border-line bg-white px-8 py-9 transition duration-150 ${styles.hoverBorder} before:absolute before:-right-14 before:-top-14 before:h-40 before:w-40 before:rounded-full before:transition-transform before:duration-200 hover:before:scale-110 ${styles.hoverBgBlob}`}
                  >
                    <div
                      className={`relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] ${styles.iconBg}`}
                    >
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z" />
                      </svg>
                    </div>
                    <h3 className="relative z-10 mb-3 font-serif text-xl font-semibold leading-7 text-navy">
                      {benefit.title}
                    </h3>
                    <p className="relative z-10 text-sm leading-7 text-navy-light">
                      {benefit.body}
                    </p>
                  </article>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
