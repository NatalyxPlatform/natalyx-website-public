import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * Name, title and education are quoted from the clinic pitch deck's team
 * slide. Nothing is added: no claimed employer, no seniority, no achievement
 * the deck does not state. Only the two founders appear here - the rest of the
 * team slide is deliberately not published on the marketing site.
 */
const founders = [
  {
    name: "Allen Cioaca",
    title: "Founder/CEO",
    education:
      "UCLA BA Economics & Psychology, University of Oxford MS Modelling for Global Health.",
    photo: "/team/allen-cioaca.jpg",
  },
  {
    name: "Luke Rhodes",
    title: "Co-Founder/CTO",
    education:
      "UCL BS Populations Health Sciences, University of Oxford MS Modelling for Global Health.",
    photo: "/team/luke-rhodes.jpg",
  },
];

export function Team() {
  return (
    <section id="team" aria-labelledby="team-heading" className="bg-paper py-20">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto mb-11 max-w-[640px] text-center">
          <ScrollReveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-accent-deep">
              Team
            </p>
            <h2
              id="team-heading"
              className="text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl"
            >
              The people building it.
            </h2>
          </ScrollReveal>
        </div>

        <ul className="mx-auto grid max-w-[980px] list-none grid-cols-1 gap-5 md:grid-cols-2">
          {founders.map((founder, index) => (
            <li key={founder.name}>
              <ScrollReveal delay={index * 90}>
                <article className="flex h-full flex-col items-center gap-5 rounded-2xl border-2 border-line bg-white px-7 py-8 text-center transition duration-150 hover:border-accent-deep sm:flex-row sm:items-start sm:text-left">
                  <Image
                    src={founder.photo}
                    alt={`${founder.name}, ${founder.title}`}
                    width={512}
                    height={512}
                    sizes="88px"
                    className="h-[88px] w-[88px] flex-shrink-0 rounded-full object-cover ring-2 ring-accent-soft"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold leading-7 text-navy">
                      {founder.name}
                    </h3>
                    <p className="mt-0.5 text-sm font-semibold text-brand-orange">
                      {founder.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-navy-light">
                      {founder.education}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
