import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function WhyNatalyx() {
  return (
    <section aria-labelledby="why-natalyx-heading" className="bg-cream py-20">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto max-w-[760px] text-center">
          <ScrollReveal>
            <h2
              id="why-natalyx-heading"
              className="mb-5 text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl md:text-[2.2rem]"
            >
              The coordination cost of a surrogacy journey lands on the clinic.
            </h2>
            <p className="mx-auto max-w-[700px] text-base leading-8 text-navy-light">
              Whether the carrier is someone the intended parents already know,
              someone referred through an agency, or someone who arrives by
              another path the clinic approves, the operational journey is
              still the clinic&apos;s to run. The scheduling, the record
              chasing, the repeated explanations, and the handoffs to counsel,
              counselors, and other professionals rarely fit the systems a
              practice already has.
            </p>
            <p className="mx-auto mt-5 max-w-[700px] text-base leading-8 text-navy-light">
              Natalyx is built to carry that operational load without taking any
              professional authority away from the people who hold it.
            </p>
            <p className="mx-auto mt-5 max-w-[700px] text-base leading-8 text-navy-light">
              It is designed to work as an extension of your clinic&apos;s
              operation rather than beside it. The clinic stays the
              coordinating center: participants and providers stay inside a
              clinic-led journey instead of being sent off into a separate
              service.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
