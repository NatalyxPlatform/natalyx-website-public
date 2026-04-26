import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function WhyNatalyx() {
  return (
    <section
      aria-labelledby="why-natalyx-heading"
      className="bg-[#f8f9fb] py-20"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto max-w-[760px] text-center">
          <ScrollReveal>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.08em] text-[#ec4899]">
              Why We&apos;re Building Natalyx
            </p>
            <h2
              id="why-natalyx-heading"
              className="mb-5 text-[1.9rem] font-bold leading-tight text-navy md:text-[2.2rem]"
            >
              Fertility journeys deserve clearer coordination from the first
              step.
            </h2>
            <p className="mx-auto max-w-[700px] text-base leading-8 text-gray-600">
              Fertility journeys are often fragmented across clinics, agencies,
              donor banks, lawyers, coordinators, forms, and timelines. People
              are asked to make life-changing decisions while trying to
              understand a system that rarely feels built around them.
            </p>
            <p className="mx-auto mt-5 max-w-[700px] text-base leading-8 text-gray-600">
              Natalyx is being built to make that path clearer: more
              transparent, more coordinated, and more human from the first
              step.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
