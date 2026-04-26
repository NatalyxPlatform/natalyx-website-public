import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const pillars = [
  {
    label: "Human-first matching support",
    description:
      "Compatibility is not only medical. Natalyx is being built to help intended parents and gestational carriers understand values, communication style, expectations, and the kind of relationship each person hopes to have.",
  },
  {
    label: "Transparent journey tracking",
    description:
      "See the major phases, milestones, documents, and next steps in one place, so the process feels less opaque.",
  },
  {
    label: "Clearer costs and fewer surprises",
    description:
      "Natalyx is designed to make costs, responsibilities, and timing easier to understand before people commit to the next stage.",
  },
  {
    label: "Privacy by design",
    description:
      "Sensitive information should move carefully. Natalyx is being built to protect privacy while helping people share what matters at the right time.",
  },
  {
    label: "Built beyond one pathway",
    description:
      "We are starting with gestational surrogacy, but Natalyx is designed for the wider ART journey, including IVF, donor conception, and partner-supported care.",
  },
];

const roles = [
  {
    title: "I'm an Intended Parent",
    body: "Explore IVF, donor conception, gestational surrogacy, or the right professional support for your situation.",
    href: "/signup?role=intended_parent",
  },
  {
    title: "I'm considering becoming a Gestational Carrier",
    body: "Learn more about the surrogacy pathway and register interest before making commitments.",
    href: "/signup?role=gestational_surrogate",
  },
  {
    title: "I'm interested in being a Donor",
    body: "Register interest in future egg or sperm donor pathways as Natalyx expands access.",
    href: "/signup?role=donor",
  },
  {
    title: "I'm not sure yet",
    body: "Start with orientation and tell us what you are trying to understand.",
    href: "/signup?role=not_sure",
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
              A better fertility journey.
            </h2>
            <p className="mx-auto max-w-[720px] text-base leading-8 text-gray-600">
              Building a family is already one of the most personal things a
              person can do. The path to it should not feel like paperwork,
              guesswork, or a series of disconnected handoffs.
            </p>
            <p className="mx-auto mt-5 max-w-[760px] text-base leading-8 text-gray-600">
              Natalyx is being built to make assisted reproduction more
              transparent, coordinated, and human. We are starting with
              gestational surrogacy, while designing the platform around the
              broader ART journey: IVF, donor conception, clinics, donors,
              gestational carriers, intended parents, and the professional
              teams around them.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={80}>
          <div className="mx-auto max-w-[820px] rounded-[20px] border border-[#fbcfe8] bg-gradient-to-br from-white to-[#fdf2f8] px-6 py-8 text-center shadow-[0_10px_40px_rgba(236,72,153,0.08)] md:px-11 md:py-10">
            <p className="text-lg font-medium leading-8 text-navy">
              Natalyx is an independent online fertility agency and ART
              marketplace built to reduce unnecessary confusion, bring more
              structure to the journey, and help people move with clearer
              costs, milestones, and expectations.
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
                A platform built for the people who need it.
              </h2>
              <p className="mx-auto mt-3 max-w-[700px] text-base leading-7 text-gray-500">
                Built around clearer coordination, more thoughtful support, and
                fewer opaque handoffs.
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
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

        <div className="mx-auto mt-14 grid max-w-[980px] grid-cols-1 gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <ScrollReveal>
              <div className="mx-auto mb-1 max-w-[680px] text-center">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-[#ec4899]">
                  Get Started
                </p>
                <h2 className="text-[1.9rem] font-bold leading-tight text-navy">
                  Let&apos;s get to know you.
                </h2>
                <p className="mx-auto mt-3 max-w-[680px] text-base leading-7 text-gray-500">
                  Choose the option that best describes your starting point.
                  This is an early interest step, not a medical, legal, or
                  clinical eligibility decision.
                </p>
              </div>
            </ScrollReveal>
          </div>
          {roles.map((role, index) => (
            <ScrollReveal key={role.title} delay={index * 90}>
              <Link
                href={role.href}
                className={`group relative block h-full overflow-hidden rounded-2xl border-2 border-gray-200 bg-white px-8 py-9 transition duration-150 hover:-translate-y-1 hover:border-primary hover:shadow-[0_10px_30px_rgba(99,102,241,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  index % 2 === 0
                    ? "before:absolute before:-right-14 before:-top-14 before:h-40 before:w-40 before:rounded-full before:bg-blue-500/15 before:transition-transform before:duration-200 hover:before:scale-110"
                    : "before:absolute before:-right-14 before:-top-14 before:h-40 before:w-40 before:rounded-full before:bg-pink-500/15 before:transition-transform before:duration-200 hover:before:scale-110"
                }`}
              >
                <div className={`relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] ${index % 2 === 0 ? "bg-blue-500/10 text-blue-600" : "bg-pink-500/10 text-pink-600"}`}>
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
                  Register interest -&gt;
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
