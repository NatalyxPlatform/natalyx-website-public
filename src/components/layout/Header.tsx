"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isWideViewport, setIsWideViewport] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const onChange = () => setIsWideViewport(mediaQuery.matches);
    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const hideLogo = isWideViewport && !scrolled;

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-line bg-cream/92 shadow-sm backdrop-blur-md"
          : "bg-cream/75 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1080px] items-center justify-between px-6 md:h-20">
        <Link
          href="/"
          aria-label="Natalyx — home"
          aria-hidden={hideLogo ? true : undefined}
          tabIndex={hideLogo ? -1 : 0}
          className={`flex items-center rounded transition-opacity duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
            scrolled
              ? "opacity-100"
              : "opacity-100 md:pointer-events-none md:opacity-0"
          }`}
        >
          <Image
            src="/natalyx_wordmark_bold.png"
            alt="Natalyx"
            width={1291}
            height={480}
            className="h-9 w-auto object-contain md:h-10"
          />
        </Link>

        <nav aria-label="Main navigation">
          <ul className="hidden md:flex items-center gap-8 list-none">
            <li>
              <Link
                href="/#who-we-help"
                className="text-sm font-medium text-navy-light transition-colors duration-150 hover:text-accent-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Mission
              </Link>
            </li>
            <li>
              <Link
                href="/#support"
                className="text-sm font-medium text-navy-light transition-colors duration-150 hover:text-accent-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                Process
              </Link>
            </li>
            <li>
              <Link
                href="/#faq"
                className="text-sm font-medium text-navy-light transition-colors duration-150 hover:text-accent-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </nav>

        <Link
          href="/signup"
          aria-hidden={!scrolled}
          tabIndex={scrolled ? 0 : -1}
          className={`inline-flex min-h-11 items-center justify-center rounded-lg bg-brand-orange px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(31,26,20,0.15)] transition-all duration-200 hover:bg-brand-orange-dark hover:text-white hover:shadow-[0_10px_24px_rgba(244,152,88,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 md:px-6 ${
            scrolled
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          }`}
        >
          Register interest
        </Link>
      </div>
    </header>
  );
}
