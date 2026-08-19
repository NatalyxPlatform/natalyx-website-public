import { Hero } from "@/components/landing/Hero";
import { ValueCards } from "@/components/landing/ValueCards";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { WhyNatalyx } from "@/components/landing/WhyNatalyx";
import { FAQ } from "@/components/landing/FAQ";
import { CTABanner } from "@/components/landing/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueCards />
      <HowItWorks />
      <WhyNatalyx />
      <FAQ />
      <CTABanner />
    </>
  );
}
