import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function WhyNatalyx() {
  return (
    <section aria-labelledby="why-natalyx-heading" className="bg-cream py-20">
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mx-auto max-w-[760px] text-center">
          <ScrollReveal>
            <h2
              id="why-natalyx-heading"
              className="mb-5 font-serif text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl md:text-[2.2rem]"
            >
              The coordination cost of a known-surrogate journey lands on the
              clinic.
            </h2>
            <p className="mx-auto max-w-[700px] text-base leading-8 text-navy-light">
              When intended parents arrive with a carrier they already know,
              there is no agency in the middle. The clinic absorbs the
              scheduling, the record chasing, the repeated explanations, and the
              handoffs to counsel, counselors, and other professionals — work
              that rarely fits the systems a practice already runs.
            </p>
            <p className="mx-auto mt-5 max-w-[700px] text-base leading-8 text-navy-light">
              Natalyx is built to carry that operational load without taking any
              professional authority away from the people who hold it.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
