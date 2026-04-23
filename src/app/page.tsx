import { Hero } from "@/components/landing/Hero";
import { ValueCards } from "@/components/landing/ValueCards";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FAQ } from "@/components/landing/FAQ";
import { CTABanner } from "@/components/landing/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueCards />
      <HowItWorks />
      <FAQ />
      <CTABanner />
    </>
  );
}
