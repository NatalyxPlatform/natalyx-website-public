import { ScrollReveal } from "@/components/ui/ScrollReveal";

const benefits = [
  {
    title: "The relay runs itself",
    body: "Preparation steps, reminders, and status chasing that an agency works through by hand are automated, so clinicians can spend their time on medical treatment.",
  },
  {
    title: "Coordination stays with the clinic",
    body: "Outside providers still take part in the journey. What changes is that the practice keeps coordinating it, at the moment patients most need continuity, rather than handing them to an intermediary who does.",
  },
  {
    title: "Handoffs carry their context",
    body: "Introductions between the clinic, participants, and outside professionals arrive with what the next pair of hands needs, so less is re-explained and less is lost between them.",
  },
  {
    title: "Nothing outstanding gets forgotten",
    body: "Missing records, unscheduled appointments, and unfinished preparation are tracked as shared work rather than living in one coordinator's memory.",
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
              className="mx-auto mb-3 max-w-[620px] text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl"
            >
              The existing agency manual workflow, fully automated and running
              within the clinic.
            </h2>
            <p className="mx-auto max-w-[720px] text-base leading-8 text-navy-light">
              What a surrogacy agency actually does, day to day, is run a
              manual relay between intended parents, the gestational carrier,
              clinical staff, and a string of outside professionals. This gets
              done via phone, email, and spreadsheet, leading to inefficient
              journey management and information lost between handoffs.
            </p>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-navy-light">
              Natalyx automates that relay and runs it inside the practice, with
              nearly no administrative overhead. The journey stays coordinated
              through the clinic&apos;s own workflow rather than being handed to
              an intermediary — keeping the patients who already trust it, and
              the revenue that leaves with them. The clinic stays the
              coordinating center throughout, and keeps full administrative
              control.
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
                    <h3 className="relative z-10 mb-3 text-xl font-semibold leading-7 text-navy">
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
