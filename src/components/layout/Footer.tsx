import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Footer() {
  return (
    <footer className="border-t border-cyan-100 bg-[#F7FCF9]" aria-label="Site footer">
      <div className="mx-auto max-w-[1160px] px-5 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <ScrollReveal>
            <div className="flex flex-col gap-4">
              <Link href="/" aria-label="Natalyx — home">
                <Image
                  src="/natalyx_primary_logo.png"
                  alt="Natalyx"
                  width={216}
                  height={70}
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <p className="max-w-sm text-sm leading-7 text-gray-500">
                Natalyx is being built to support people growing their families
                through gestational surrogacy, and those considering helping
                along the way.
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
                      href="/#who-we-help"
                      className="text-sm text-gray-500 hover:text-primary transition-colors duration-150"
                    >
                      Who we help
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#support"
                      className="text-sm text-gray-500 hover:text-primary transition-colors duration-150"
                    >
                      Next steps
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/#faq"
                      className="text-sm text-gray-500 hover:text-primary transition-colors duration-150"
                    >
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="text-sm text-gray-500 hover:text-primary transition-colors duration-150"
                    >
                      Register interest
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={140}>
          <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-cyan-100 pt-7 sm:flex-row sm:items-center">
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} Natalyx. All rights reserved.
            </p>
            <p className="text-xs text-gray-400">
              Early interest registration is open.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
