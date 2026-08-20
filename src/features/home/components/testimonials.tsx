"use client";

import {
  useEffect,
  useState,
  type FocusEvent,
  type SVGProps,
} from "react";

const STEP_INTERVAL_MS = 2500;
const SLIDE_TRANSITION_MS = 600;
const RESET_REENABLE_DELAY_MS = 20;
const VISIBLE_COUNT = 4;

type Review = {
  id: string;
  name: string;
  achievement: string;
  quote: string;
  rating: number;
};

const reviews: Review[] = [
  {
    id: "marcus",
    name: "Marcus R.",
    achievement: "Lost 12kg in 6 months",
    quote:
      "I walked in barely knowing how to warm up, and now I train five days a week. The coaches check your form on every set.",
    rating: 5,
  },
  {
    id: "lucy",
    name: "Lucy F.",
    achievement: "Member since 2023",
    quote:
      "Group classes are the best part of my day. There's always someone pushing you for one more rep.",
    rating: 5,
  },
  {
    id: "diego",
    name: "Diego M.",
    achievement: "Doubled his squat",
    quote:
      "The Pro plan's personal training sessions completely changed my progress. I've never lifted this heavy with this much confidence.",
    rating: 4,
  },
  {
    id: "valerie",
    name: "Valerie S.",
    achievement: "Training for a marathon",
    quote:
      "AI Coach access helped me plan my load and recovery weeks without getting lost in spreadsheets.",
    rating: 5,
  },
  {
    id: "thomas",
    name: "Thomas B.",
    achievement: "200-day streak",
    quote:
      "The atmosphere is motivating without being intimidating. It's the first gym I haven't missed a single day at.",
    rating: 5,
  },
  {
    id: "camille",
    name: "Camille O.",
    achievement: "Recovered from a knee injury",
    quote:
      "The team helped me get back to training after a knee injury with a careful, no-rush progression.",
    rating: 4,
  },
  {
    id: "nicholas",
    name: "Nicholas P.",
    achievement: "Member since 2022",
    quote:
      "Extended hours let me train before work. The equipment is always available and well maintained.",
    rating: 5,
  },
  {
    id: "sophia",
    name: "Sophia A.",
    achievement: "First powerlifting meet",
    quote:
      "I went from training alone at home to competing this year. The coaches' guidance was key to getting ready.",
    rating: 5,
  },
];

// Se duplican las primeras VISIBLE_COUNT reseñas al final para poder animar
// el último paso del loop como un slide normal y luego saltar sin
// transición de vuelta al índice 0 (misma ventana visible, sin salto visual).
const trackReviews: Review[] = [...reviews, ...reviews.slice(0, VISIBLE_COUNT)];

function StarIcon({
  filled,
  ...props
}: SVGProps<SVGSVGElement> & { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className={filled ? "text-orange-500" : "text-white/20"}
      {...props}
    >
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.98l-5.2 2.54.99-5.8-4.21-4.1 5.82-.85L10 1.5Z" />
    </svg>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-white/10 bg-neutral-900 p-6">
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 font-[family-name:var(--font-baloo-2)] text-sm font-bold text-orange-500"
        >
          {getInitials(review.name)}
        </div>
        <div>
          <p className="font-[family-name:var(--font-baloo-2)] font-bold text-white">
            {review.name}
          </p>
          <p className="text-xs text-gray-400">{review.achievement}</p>
        </div>
      </div>

      <div
        role="img"
        aria-label={`${review.rating} out of 5 stars`}
        className="flex gap-0.5"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <StarIcon
            key={index}
            filled={index < review.rating}
            className="h-4 w-4"
          />
        ))}
      </div>

      <p className="text-sm text-gray-300">{review.quote}</p>
    </article>
  );
}

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Avanza la ventana de a un paso mientras no esté pausada ni en el tramo
  // final del loop (ver el efecto de reset más abajo).
  useEffect(() => {
    if (index >= reviews.length) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion || isPaused) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setIndex((current) => current + 1);
    }, STEP_INTERVAL_MS);
    return () => clearTimeout(timeoutId);
  }, [index, isPaused]);

  // Al llegar al tramo duplicado (visualmente idéntico al inicio), se espera
  // a que termine el slide y se salta al índice 0 sin transición.
  useEffect(() => {
    if (index !== reviews.length) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setTransitionEnabled(false);
      setIndex(0);
    }, SLIDE_TRANSITION_MS);
    return () => clearTimeout(timeoutId);
  }, [index]);

  // Reactiva la transición en el siguiente tick para que el salto anterior
  // sea instantáneo, pero el próximo paso vuelva a animarse.
  useEffect(() => {
    if (transitionEnabled) {
      return;
    }

    const timeoutId = setTimeout(
      () => setTransitionEnabled(true),
      RESET_REENABLE_DELAY_MS,
    );
    return () => clearTimeout(timeoutId);
  }, [transitionEnabled]);

  function handleFocusLeave(event: FocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsPaused(false);
    }
  }

  return (
    <section
      id="reviews"
      className="bg-neutral-950 px-4 py-20 sm:px-6 sm:py-28"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-[family-name:var(--font-changa-one)] text-4xl tracking-tight text-orange-500 uppercase sm:text-5xl">
          What Our Members Say
        </h2>
        <p className="mt-4 text-base text-gray-300 sm:text-lg">
          Real stories from people training at FORGE.
        </p>
      </div>

      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={handleFocusLeave}
        className="mx-auto mt-16 max-w-6xl"
      >
        <div className="-mx-4 overflow-hidden [--visible:1] sm:[--visible:2] lg:[--visible:4]">
          <div
            className="flex"
            style={{
              width: `calc(${trackReviews.length} / var(--visible) * 100%)`,
              transform: `translateX(-${(index * 100) / trackReviews.length}%)`,
              transition: transitionEnabled
                ? `transform ${SLIDE_TRANSITION_MS}ms ease-in-out`
                : "none",
            }}
          >
            {trackReviews.map((review, position) => (
              <div
                key={`${review.id}-${position}`}
                className="shrink-0 px-4"
                style={{ width: `${100 / trackReviews.length}%` }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
