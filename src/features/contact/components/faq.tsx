import type { SVGProps } from "react";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    id: "cancel",
    question: "Can I cancel my membership anytime?",
    answer:
      "The Monthly plan can be cancelled anytime with no hidden fees. Annual and Pro plans renew automatically unless cancelled before the next billing date.",
  },
  {
    id: "trial",
    question: "Do you offer a free trial or day pass?",
    answer:
      "Yes — stop by any location for a free tour of the gym floor and group classes, or book one through the contact form above.",
  },
  {
    id: "ai-coach",
    question: "What's included with AI Coach access?",
    answer:
      "Pro members get priority AI Coach access for personalized workout plans, recovery guidance, and progress tracking right from your phone.",
  },
  {
    id: "personal-training",
    question: "Are personal trainers included in my plan?",
    answer:
      "Annual plans include one personal training session per quarter, and Pro plans include unlimited sessions with a dedicated coach.",
  },
  {
    id: "hours",
    question: "What are your opening hours?",
    answer:
      "Most locations are open Monday to Saturday, 6am to 10pm. Check each location card above for hours near you.",
  },
];

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function Faq() {
  return (
    <section className="bg-neutral-950 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-[family-name:var(--font-changa-one)] text-4xl tracking-tight text-orange-500 uppercase sm:text-5xl">
          FAQ
        </h2>
        <p className="mt-4 text-base text-gray-300 sm:text-lg">
          Common questions about training with FORGE.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl divide-y divide-white/10 rounded-2xl border border-white/10 bg-neutral-800 px-6">
        {faqs.map((faq, index) => (
          <details key={faq.id} name="faq" open={index === 0} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:content-none [&::-webkit-details-marker]:hidden">
              <span className="font-[family-name:var(--font-baloo-2)] font-semibold text-white">
                {faq.question}
              </span>
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-orange-500">
                <PlusIcon className="h-4 w-4 group-open:hidden" />
                <MinusIcon className="hidden h-4 w-4 group-open:block" />
              </span>
            </summary>
            <p className="mt-3 text-sm text-gray-300">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
