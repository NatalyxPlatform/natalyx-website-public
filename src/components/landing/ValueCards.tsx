import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const roles = [
  {
    title: "I'm an Intended Parent",
    href: "/signup?role=intended_parent",
  },
  {
    title: "I'm considering becoming a Gestational Carrier",
    href: "/signup?role=gestational_surrogate",
  },
  {
    title: "I'm interested in being a Donor",
    href: "/signup?role=donor",
  },
  {
    title: "I'm not sure yet",
    href: "/signup?role=not_sure",
  },
];

const roleStyles = [
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
      id="who-we-help"
      aria-labelledby="who-we-help-heading"
      className="bg-paper py-[70px]"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <ScrollReveal>
          <div className="mx-auto max-w-[760px] rounded-2xl border border-line bg-cream px-6 py-10 text-center shadow-[0_12px_30px_rgba(31,26,20,0.04)] md:px-12 md:py-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-accent-deep">
              Our Mission
            </p>
            <h2
              id="who-we-help-heading"
              className="mx-auto mb-3 max-w-[620px] font-serif text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl"
            >
              A better fertility journey.
            </h2>
            <p className="mx-auto max-w-[720px] text-base leading-8 text-navy-light">
              Building a family is already one of the most personal things a
              person can do. The path to it should not feel like paperwork,
              guesswork, or a series of disconnected handoffs.
            </p>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-navy-light">
              Natalyx makes assisted reproduction more transparent,
              coordinated, and human. We are starting with gestational
              surrogacy, while designing the platform around the entire ART
              journey.
            </p>
          </div>
        </ScrollReveal>

        <div className="mx-auto mt-16 grid max-w-[980px] grid-cols-1 gap-5 md:grid-cols-2">
          {roles.map((role, index) => {
            const styles = roleStyles[index] || roleStyles[0];
            return (
              <ScrollReveal key={role.title} delay={80 + index * 90}>
                <Link
                  href={role.href}
                  className={`group relative block h-full overflow-hidden rounded-2xl border-2 border-line bg-white px-8 py-9 transition duration-150 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(31,26,20,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${styles.hoverBorder} before:absolute before:-right-14 before:-top-14 before:h-40 before:w-40 before:rounded-full before:transition-transform before:duration-200 hover:before:scale-110 ${styles.hoverBgBlob}`}
                >
                  <div className={`relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] ${styles.iconBg}`}>
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
                  <h3 className="mb-3 font-serif text-xl font-semibold leading-7 text-navy">
                    {role.title}
                  </h3>
                  <span className="text-sm font-semibold text-accent-deep transition-colors group-hover:text-accent">
                    Register interest -&gt;
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
