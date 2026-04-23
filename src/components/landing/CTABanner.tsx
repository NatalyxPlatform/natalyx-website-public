import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function CTABanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden bg-white py-20"
    >
      <div className="relative mx-auto max-w-[1080px] px-6 text-center">
        <div className="mx-auto max-w-[760px]">
          <ScrollReveal>
            <h2
              id="cta-heading"
              className="mb-4 text-[1.9rem] font-bold leading-tight text-navy md:text-[2.35rem]"
            >
              Tell us where you are starting, and we will be in touch.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={90}>
            <p className="mx-auto max-w-[620px] leading-7 text-gray-600">
              We are not publicly available yet. Interest registration helps us
              open access with care.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={160}>
            <div className="mt-8">
              <Button href="/signup" size="lg" className="w-full sm:w-auto">
                Register interest
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
