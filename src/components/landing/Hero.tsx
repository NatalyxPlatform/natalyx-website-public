import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Hero() {
  return (
    <section
      aria-label="Natalyx introduction"
      className="relative isolate overflow-hidden bg-[#f8f9fb]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_15%_20%,rgba(99,102,241,0.12)_0%,transparent_45%),radial-gradient(ellipse_at_85%_30%,rgba(236,72,153,0.1)_0%,transparent_45%)] [mask-image:linear-gradient(to_bottom,transparent_0,black_56px,black_calc(100%-56px),transparent_100%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 bg-gradient-to-b from-transparent via-white/70 to-white"
        aria-hidden="true"
      />
      <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-[1080px] grid-cols-1 items-center gap-10 px-6 pb-14 pt-8 md:min-h-[680px] lg:grid-cols-[1fr_0.82fr] lg:gap-16 lg:pb-16 lg:pt-16">
        <div className="relative z-10 max-w-2xl">
          <ScrollReveal y="sm">
            <p className="mb-5 inline-flex rounded-full bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-primary">
              Early interest registration
            </p>
          </ScrollReveal>
          <ScrollReveal delay={70} y="sm">
            <h1 className="mb-5 max-w-[780px] text-[2.35rem] font-bold leading-[1.12] text-navy sm:text-5xl lg:text-[3.35rem]">
              Every family&apos;s story deserves{" "}
              <span className="bg-gradient-to-br from-primary to-[#ec4899] bg-clip-text text-transparent">
                a beginning like this
              </span>
              .
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={130} y="sm">
            <p className="mb-8 max-w-[620px] text-base leading-8 text-gray-600 md:text-lg">
              Natalyx is being built as a transparent, care-first online agency
              for people hoping to grow their family and people considering
              helping another family. Register interest now, and we will follow
              up when there is a thoughtful next step to share.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={200} y="sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button href="/signup" size="lg" className="w-full sm:w-auto">
                Register interest
              </Button>
              <p className="text-sm leading-6 text-gray-500 sm:max-w-48">
                No commitment. No sensitive details needed yet.
              </p>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal
          className="relative z-10 mx-auto hidden w-full max-w-[620px] items-center justify-center md:flex"
          delay={260}
          y="sm"
        >
          <div className="relative aspect-[1.04] w-full max-w-[470px] sm:max-w-[560px]">
            <Image
              src="/stork_icon.png"
              alt=""
              width={640}
              height={640}
              priority
              className="absolute left-1/2 top-1/2 h-auto w-[82%] max-w-[440px] -translate-x-1/2 -translate-y-1/2 opacity-80"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
