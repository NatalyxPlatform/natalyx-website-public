"use client";

import { useEffect, useRef, useState } from "react";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: "sm" | "md";
};

const translateClass = {
  sm: "translate-y-4",
  md: "translate-y-8",
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  y = "md",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const revealIfPassed = () => {
      if (node.getBoundingClientRect().top <= window.innerHeight * 0.88) {
        setIsVisible(true);
      }
    };

    revealIfPassed();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.18 },
    );

    observer.observe(node);
    window.addEventListener("scroll", revealIfPassed, { passive: true });
    window.addEventListener("resize", revealIfPassed);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealIfPassed);
      window.removeEventListener("resize", revealIfPassed);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : `${translateClass[y]} opacity-0`
      } ${className}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
