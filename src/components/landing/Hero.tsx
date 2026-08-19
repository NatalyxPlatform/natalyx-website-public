import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CLINIC_INTEREST_PATH } from "@/lib/constants";

export function Hero() {
  return (
    <section
      aria-label="Natalyx introduction"
      className="relative isolate overflow-hidden bg-cream"
    >
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 bg-gradient-to-b from-transparent via-white/70 to-white"
        aria-hidden="true"
      />
      <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-[1080px] grid-cols-1 items-center gap-10 px-6 pb-14 pt-8 md:min-h-[680px] lg:grid-cols-[1fr_0.95fr] lg:gap-12 lg:pb-16 lg:pt-16">
        <div className="relative z-10 max-w-2xl">
          <ScrollReveal delay={40} y="sm">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-accent-deep">
              For fertility clinics
            </p>
          </ScrollReveal>
          <ScrollReveal delay={70} y="sm">
            <h1 className="mb-5 max-w-[780px] font-serif text-[2.35rem] font-medium leading-[1.12] tracking-tight text-navy sm:text-5xl lg:text-[3.35rem]">
              Coordinate known-surrogate journeys without{" "}
              <span className="relative inline-block italic text-brand-orange after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:z-[-1] after:h-2 after:rounded-full after:bg-brand-orange/15">
                another operational burden
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={130} y="sm">
            <p className="mb-8 max-w-[620px] text-base leading-8 text-navy-light md:text-lg">
              Natalyx helps fertility clinics organize participant preparation,
              provider handoffs, outstanding records, appointments, and shared
              journey context — while the clinic and its providers remain
              authoritative throughout.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200} y="sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button
                href={CLINIC_INTEREST_PATH}
                size="lg"
                className="w-full !bg-brand-orange !text-white hover:!bg-brand-orange-dark hover:shadow-[0_8px_22px_rgba(244,152,88,0.28)] focus-visible:ring-brand-orange sm:w-auto"
              >
                Register your clinic&apos;s interest
              </Button>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={250} y="sm">
            <p className="mt-3 text-sm leading-6 text-navy-light/70 sm:max-w-[560px]">
              Four details, no patient information. Natalyx is not generally
              available yet.
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal
          className="relative z-10 mx-auto hidden w-full max-w-[700px] items-center justify-center md:flex"
          delay={260}
          y="sm"
        >
          <div className="relative aspect-[1.04] w-full max-w-[640px]">
            <Image
              src="/natalyx_combined_icon.png"
              alt=""
              width={1441}
              height={1441}
              priority
              className="absolute left-1/2 top-1/2 h-auto w-[96%] max-w-[570px] -translate-x-1/2 -translate-y-1/2 opacity-90"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
