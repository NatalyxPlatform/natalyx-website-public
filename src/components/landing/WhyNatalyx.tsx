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
              Patients trust the clinic, then get handed to an intermediary.
            </h2>
            <p className="mx-auto max-w-[700px] text-base leading-8 text-navy-light">
              Handing a surrogacy journey to an agency has always been the
              practical option, because coordinating it inside the practice
              meant taking on the work that agency does by hand. Whether the
              carrier is someone the intended parents already know or someone
              the clinic itself referred, that relay is the same: scheduling,
              record chasing, repeated explanations, and handoffs to counsel,
              counselors, and other professionals.
            </p>
            <p className="mx-auto mt-5 max-w-[700px] text-base leading-8 text-navy-light">
              Automating that relay is what lets the clinic keep coordinating
              the journey instead of handing it over. Outside professionals
              still participate — what changes is that the journey runs through
              the clinic&apos;s workflow, at the point in a patient&apos;s care
              where continuity matters most, and the overhead of running it
              stays small.
            </p>
            <p className="mx-auto mt-5 max-w-[700px] text-base leading-8 text-navy-light">
              Natalyx is designed to work as an extension of your clinic&apos;s
              operation rather than beside it. The clinic stays the coordinating
              center and its providers stay authoritative: nobody is handed off
              into a separate service, and no clinical, legal, or eligibility
              judgment moves to the software.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
