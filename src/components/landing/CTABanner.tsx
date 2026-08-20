import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CLINIC_INTEREST_PATH } from "@/lib/constants";

export function CTABanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden bg-cream-deep py-20"
    >
      <div className="relative mx-auto max-w-[1080px] px-6 text-center">
        <div className="mx-auto max-w-[760px]">
          <ScrollReveal>
            <h2
              id="cta-heading"
              className="mb-4 text-[1.9rem] font-medium leading-tight text-navy sm:text-4xl md:text-[2.35rem]"
            >
              Book a demo.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={90}>
            <p className="mx-auto max-w-[620px] leading-7 text-navy-light">
              Natalyx is looking for 10 fertility clinics to join a pilot
              program. Register your clinic&apos;s interest and we will get back
              to you shortly to set up a demo — four details, no patient
              information, no commitment.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <div className="mt-8">
              <Button
                href={CLINIC_INTEREST_PATH}
                size="lg"
                className="w-full !bg-brand-orange !text-white hover:!bg-brand-orange-dark hover:shadow-[0_8px_22px_rgba(244,152,88,0.28)] focus-visible:ring-brand-orange sm:w-auto"
              >
                Register your clinic&apos;s interest
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
