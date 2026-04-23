import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const pillars = [
  {
    label: "Find out how we can help",
    description:
      "Start with clear, personalized orientation around your goals, questions, and the kind of support you may need.",
  },
  {
    label: "Transparent next steps",
    description: "Access to Natalyx is being opened carefully.",
  },
  {
    label: "Privacy by design",
    description:
      "The public form asks for general context only. Save sensitive case details for when the Natalyx platform is live. Don't worry; we'll be in touch soon.",
  },
];

const roles = [
  {
    title: "I am hoping to start or grow my family",
    body: "For intended parents exploring fertility care, surrogacy, donation, or the right professional team.",
    href: "/signup?role=intended_parent",
  },
  {
    title: "I am considering helping another family",
    body: "For people exploring gestational surrogacy and wanting a safer, clearer way to understand the path.",
    href: "/signup?role=gestational_surrogate",
  },
];

export function ValueCards() {
  return (
    <section
      id="who-we-help"
      aria-labelledby="who-we-help-heading"
      className="bg-white py-[70px]"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto mb-11 max-w-[640px] text-center">
          <ScrollReveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-[#ec4899]">
              Our Mission
            </p>
            <h2
              id="who-we-help-heading"
              className="mx-auto mb-3 max-w-[620px] text-[1.9rem] font-bold leading-tight text-navy"
            >
              A single place for modern fertility, so the process never becomes
              complicated.
            </h2>
            <p className="mx-auto max-w-[640px] text-base leading-7 text-gray-500">
              Natalyx starts with orientation, privacy-conscious intake, and a
              clear handoff to the right next conversation when access is
              available.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={80}>
          <div className="mx-auto max-w-[820px] rounded-[20px] border border-[#fbcfe8] bg-gradient-to-br from-white to-[#fdf2f8] px-6 py-8 text-center shadow-[0_10px_40px_rgba(236,72,153,0.08)] md:px-11 md:py-10">
            <p className="text-lg font-medium leading-8 text-navy">
              Natalyx is being built for complete clarity before any
              commitments: those pursuing parenthood wanting a path forward,
              people considering becoming gestational carriers, and anyone
              still figuring out where they fit.
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-[70px]">
          <div className="mx-auto mb-11 max-w-[640px] text-center">
            <ScrollReveal>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-[#ec4899]">
                What Makes Us Different
              </p>
              <h2 className="text-[1.9rem] font-bold leading-tight text-navy">
                A platform built for care, not pressure.
              </h2>
            </ScrollReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <ScrollReveal
              key={pillar.label}
              delay={index * 80}
            >
              <article className="h-full rounded-[14px] border border-gray-200 bg-white px-6 py-7 transition duration-150 hover:-translate-y-1 hover:border-[#c7d2fe] hover:shadow-[0_8px_24px_rgba(99,102,241,0.08)]">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                  0{index + 1}
                </div>
                <h3 className="mb-2 text-[1.02rem] font-bold leading-6 text-navy">
                  {pillar.label}
                </h3>
                <p className="text-sm leading-6 text-gray-600">
                  {pillar.description}
                </p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="mx-auto mt-14 grid max-w-[760px] grid-cols-1 gap-5 md:grid-cols-2">
          {roles.map((role, index) => (
            <ScrollReveal key={role.title} delay={index * 90}>
              <Link
                href={role.href}
                className={`group relative block h-full overflow-hidden rounded-2xl border-2 border-gray-200 bg-white px-8 py-9 transition duration-150 hover:-translate-y-1 hover:border-primary hover:shadow-[0_10px_30px_rgba(99,102,241,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  index === 0
                    ? "before:absolute before:-right-14 before:-top-14 before:h-40 before:w-40 before:rounded-full before:bg-blue-500/15 before:transition-transform before:duration-200 hover:before:scale-110"
                    : "before:absolute before:-right-14 before:-top-14 before:h-40 before:w-40 before:rounded-full before:bg-pink-500/15 before:transition-transform before:duration-200 hover:before:scale-110"
                }`}
              >
                <div className={`relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] ${index === 0 ? "bg-blue-500/10 text-blue-600" : "bg-pink-500/10 text-pink-600"}`}>
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
                <h3 className="mb-3 text-xl font-semibold leading-7 text-navy">
                  {role.title}
                </h3>
                <p className="mb-6 text-base leading-7 text-gray-600">
                  {role.body}
                </p>
                <span className="text-sm font-semibold text-primary transition-colors group-hover:text-primary-dark">
                  Register interest
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
