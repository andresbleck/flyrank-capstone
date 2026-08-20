import type { SVGProps } from "react";
import { Button } from "@/components/ui/button";

type Plan = {
  id: string;
  name: string;
  price: string;
  billingNote: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$49",
    billingNote: "billed monthly",
    tagline: "Stay flexible, cancel anytime.",
    features: [
      "Full gym floor & equipment access",
      "Unlimited group classes",
      "Free locker & towel service",
    ],
    ctaLabel: "Choose Monthly",
  },
  {
    id: "annual",
    name: "Annual",
    price: "$39",
    billingNote: "billed annually ($468/yr)",
    tagline: "Commit for a year, save every month.",
    features: [
      "Everything in Monthly",
      "1 personal training session / quarter",
      "2 guest passes every month",
    ],
    ctaLabel: "Choose Annual",
    highlighted: true,
    badge: "Most popular · Save 20%",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$89",
    billingNote: "billed monthly",
    tagline: "For people who want a coach in their corner.",
    features: [
      "Everything in Annual",
      "Unlimited personal training sessions",
      "Priority AI Coach access & recovery zone",
    ],
    ctaLabel: "Go Pro",
  },
];

function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.4 7.4a1 1 0 0 1-1.4 0L3.3 9.5a1 1 0 1 1 1.4-1.4l3.9 3.9 6.7-6.7a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function PricingPlans() {
  return (
    <section id="plans" className="bg-neutral-950 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-[family-name:var(--font-changa-one)] text-4xl tracking-tight text-orange-500 uppercase sm:text-5xl">
          Membership Plans
        </h2>
        <p className="mt-4 text-base text-gray-300 sm:text-lg">
          Pick the plan that matches your commitment. No hidden fees, cancel
          anytime.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <article
            key={plan.id}
            className={`group relative isolate flex flex-col overflow-hidden rounded-2xl border bg-neutral-900 p-8 ${
              plan.highlighted
                ? "border-orange-500 ring-1 ring-orange-500/50"
                : "border-white/10"
            }`}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 bg-white opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-5"
            />

            {plan.badge && (
              <span className="mb-4 w-fit rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                {plan.badge}
              </span>
            )}

            <h3 className="font-[family-name:var(--font-baloo-2)] text-2xl font-bold text-white">
              {plan.name}
            </h3>
            <p className="mt-1 text-sm text-gray-400">{plan.tagline}</p>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-[family-name:var(--font-baloo-2)] text-4xl font-bold text-orange-500">
                {plan.price}
              </span>
              <span className="text-sm text-gray-400">/mo</span>
            </div>
            <p className="text-xs text-gray-500">{plan.billingNote}</p>

            <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm text-gray-200">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              type="button"
              variant={plan.highlighted ? "accent" : "outline"}
              className="mt-8 font-[family-name:var(--font-baloo-2)] font-semibold"
            >
              {plan.ctaLabel}
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}
