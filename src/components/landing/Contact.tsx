import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * The contact details from the pitch deck's contact slide, verbatim. Both
 * numbers are rendered as `tel:` links using the digits only, so the displayed
 * formatting stays exactly as the deck writes it.
 */
const contacts = [
  {
    name: "Allen Cioaca",
    phone: "(858) 925-3525",
    tel: "+18589253525",
    email: "allen@natalyx.health",
  },
  {
    name: "Luke Rhodes",
    phone: "(609) 309-2170",
    tel: "+16093092170",
    email: "luke@natalyx.health",
  },
];

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-y border-line bg-cream py-20"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto mb-10 max-w-[640px] text-center">
          <ScrollReveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-accent-deep">
              Contact
            </p>
            <h2
              id="contact-heading"
              className="text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl"
            >
              Talk to us directly.
            </h2>
            <p className="mx-auto mt-3 max-w-[560px] text-base leading-7 text-navy-light">
              Please keep patient, medical, legal, and case information out of
              these channels.
            </p>
          </ScrollReveal>
        </div>

        <ul className="mx-auto grid max-w-[980px] list-none grid-cols-1 gap-5 md:grid-cols-2">
          {contacts.map((contact, index) => (
            <li key={contact.name}>
              <ScrollReveal delay={index * 90}>
                <article className="h-full rounded-2xl border-2 border-line bg-white px-7 py-7 transition duration-150 hover:border-accent-deep">
                  <h3 className="text-lg font-semibold leading-7 text-navy">
                    {contact.name}
                  </h3>
                  <dl className="mt-3 space-y-2 text-sm leading-7">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <dt className="text-navy-light/70">Phone</dt>
                      <dd>
                        <a
                          href={`tel:${contact.tel}`}
                          className="rounded text-navy-light transition-colors hover:text-accent-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {contact.phone}
                        </a>
                      </dd>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <dt className="text-navy-light/70">Email</dt>
                      <dd className="min-w-0">
                        <a
                          href={`mailto:${contact.email}`}
                          className="break-all rounded text-navy-light transition-colors hover:text-accent-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {contact.email}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </article>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
