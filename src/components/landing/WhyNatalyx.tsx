import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function WhyNatalyx() {
  return (
    <section
      aria-labelledby="why-natalyx-heading"
      className="bg-cream py-20"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto max-w-[760px] text-center">
          <ScrollReveal>
            <h2
              id="why-natalyx-heading"
              className="mb-5 font-serif text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl md:text-[2.2rem]"
            >
              Fertility journeys deserve clearer coordination from the first
              step.
            </h2>
            <p className="mx-auto max-w-[700px] text-base leading-8 text-navy-light">
              Fertility journeys are often fragmented across clinics, agencies,
              donor banks, lawyers, coordinators, forms, and timelines. People
              are asked to make life-changing decisions while trying to
              understand a system that rarely feels built around them.
            </p>
            <p className="mx-auto mt-5 max-w-[700px] text-base leading-8 text-navy-light">
              Natalyx makes that path clearer: more transparent, more
              coordinated, and more human from the first step.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
