import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { CLINIC_INTEREST_PATH, DEVELOPER_ACCESS_URL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream" aria-label="Site footer">
      <div className="mx-auto max-w-[1160px] px-5 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <ScrollReveal>
            <div className="flex flex-col gap-4">
              <Link href="/" aria-label="Natalyx — home">
                <Image
                  src="/natalyx_wordmark_bold.png"
                  alt="Natalyx"
                  width={1291}
                  height={480}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="max-w-sm text-sm leading-7 text-navy-light">
                Natalyx - operational infrastructure for fertility clinics coordinating surrogacy journeys.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={90}>
            <div className="flex flex-col gap-3 md:items-end md:text-right">
              <h3 className="text-sm font-semibold uppercase text-navy">
                Natalyx
              </h3>
              <nav aria-label="Footer navigation">
                <ul className="flex list-none flex-col gap-2">
                  <li>
                    <Link
                      href="/#for-clinics"
                      className="text-sm text-navy-light hover:text-accent-deep transition-colors duration-150"
                    >
                      For clinics
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#how-it-works"
                      className="text-sm text-navy-light hover:text-accent-deep transition-colors duration-150"
                    >
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#faq"
                      className="text-sm text-navy-light hover:text-accent-deep transition-colors duration-150"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={CLINIC_INTEREST_PATH}
                      className="text-sm text-navy-light hover:text-accent-deep transition-colors duration-150"
                    >
                      Register your clinic&apos;s interest
                    </Link>
                  </li>
                  <li>
                    <a
                      href={DEVELOPER_ACCESS_URL}
                      className="text-sm text-navy-light hover:text-accent-deep transition-colors duration-150"
                    >
                      Developer access
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={140}>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-line pt-7 sm:flex-row sm:items-center">
            <p className="text-xs text-navy-light/60">
              &copy; {new Date().getFullYear()} Natalyx. All rights reserved.
            </p>
            <p className="text-xs text-navy-light/60">
              Clinic interest registration is open as Natalyx is introduced to new practices.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
