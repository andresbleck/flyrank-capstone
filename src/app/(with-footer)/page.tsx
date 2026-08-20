import { Hero } from "@/features/home/components/hero";
import { MetricsSection } from "@/features/home/components/metrics";
import { PricingPlans } from "@/features/home/components/pricing-plans";
import { Testimonials } from "@/features/home/components/testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <PricingPlans />
      <MetricsSection />
      <Testimonials />
    </>
  );
}
