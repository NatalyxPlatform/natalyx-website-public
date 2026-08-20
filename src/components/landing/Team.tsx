import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * Name, title, education and contact details are quoted from the clinic pitch
 * deck's team and contact slides. Nothing is added: no claimed employer, no
 * seniority, no credential the deck does not state. Only the two founders
 * appear here - the rest of the team slide is deliberately not published.
 *
 * `tel` is the digits the link dials; `phone` is what the card shows. They are
 * kept as separate fields, and asserted to agree, because a tel: link that
 * dials a different number from the one printed beside it is invisible to
 * every check except the person who gets the wrong call.
 */
const founders = [
  {
    name: "Allen Cioaca",
    title: "Founder/CEO",
    education:
      "UCLA BA Economics & Psychology, University of Oxford MS Modelling for Global Health.",
    photo: "/team/allen-cioaca.jpg",
    phone: "(858) 925-3525",
    tel: "+18589253525",
    email: "allen@natalyx.health",
  },
  {
    name: "Luke Rhodes",
    title: "Co-Founder/CTO",
    education:
      "UCL BS Populations Health Sciences, University of Oxford MS Modelling for Global Health.",
    photo: "/team/luke-rhodes.jpg",
    phone: "(609) 309-2170",
    tel: "+16093092170",
    email: "luke@natalyx.health",
  },
];

const linkStyles =
  "rounded text-navy-light underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-deep hover:decoration-accent-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

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
            <p className="mx-auto mt-3 max-w-[560px] text-base leading-7 text-navy-light">
              Talk to us directly. Please keep patient, medical, legal, and case
              information out of these channels.
            </p>
          </ScrollReveal>
        </div>

        <ul className="mx-auto grid max-w-[980px] list-none grid-cols-1 gap-5 md:grid-cols-2">
          {/* h-full runs through the ScrollReveal wrapper too - see ValueCards. */}
          {founders.map((founder, index) => (
            <li key={founder.name} className="h-full">
              <ScrollReveal className="h-full" delay={index * 90}>
                <article className="flex h-full flex-col items-center gap-5 rounded-2xl border-2 border-line bg-white px-7 py-8 text-center transition duration-150 hover:border-accent-deep sm:flex-row sm:items-start sm:text-left">
                  {/*
                    Served straight from /public rather than through the image
                    optimizer. At 88px the optimizer saves a few kilobytes and
                    adds a runtime dependency: where it is unavailable - a
                    static export, or a host without that route - every avatar
                    fails to a broken icon while the rest of the page renders
                    perfectly. Not a trade worth making for two small files.
                  */}
                  <Image
                    src={founder.photo}
                    alt={`${founder.name}, ${founder.title}`}
                    width={256}
                    height={256}
                    unoptimized
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

                    <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm leading-6">
                      <div className="flex flex-col items-center gap-x-2 sm:flex-row sm:items-baseline">
                        <dt className="text-xs uppercase tracking-[0.06em] text-navy-light/60">
                          Email
                        </dt>
                        <dd className="min-w-0">
                          <a
                            href={`mailto:${founder.email}`}
                            className={`break-all ${linkStyles}`}
                          >
                            {founder.email}
                          </a>
                        </dd>
                      </div>
                      <div className="flex flex-col items-center gap-x-2 sm:flex-row sm:items-baseline">
                        <dt className="text-xs uppercase tracking-[0.06em] text-navy-light/60">
                          Phone
                        </dt>
                        <dd>
                          <a
                            href={`tel:${founder.tel}`}
                            className={linkStyles}
                          >
                            {founder.phone}
                          </a>
                        </dd>
                      </div>
                    </dl>
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
