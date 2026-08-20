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
              Referring a surrogacy journey out has always been the practical
              option, because building the coordination in-house meant taking on
              the work an agency does by hand. Whether the carrier is someone
              the intended parents already know, someone referred through an
              agency, or someone who arrives by another path the clinic
              approves, that relay is the same: scheduling, record chasing,
              repeated explanations, and handoffs to counsel, counselors, and
              other professionals.
            </p>
            <p className="mx-auto mt-5 max-w-[700px] text-base leading-8 text-navy-light">
              Automating that relay is what removes the reason to refer out. The
              journey stays with the clinicians the patient already trusts, at
              the point in their care where continuity matters most, and the
              overhead of running it stays small.
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
