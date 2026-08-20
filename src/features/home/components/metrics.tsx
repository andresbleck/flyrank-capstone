"use client";

import { useEffect, useRef, useState } from "react";

const COUNT_UP_DURATION_MS = 2000;

type Metric = {
  id: string;
  target: number;
  decimals: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const metrics: Metric[] = [
  {
    id: "members",
    target: 5000,
    decimals: 0,
    prefix: "+",
    label: "Active members",
  },
  {
    id: "locations",
    target: 3,
    decimals: 0,
    label: "Locations in Tucumán",
  },
  {
    id: "classes",
    target: 50,
    decimals: 0,
    prefix: "+",
    label: "Weekly classes",
  },
  {
    id: "rating",
    target: 4.9,
    decimals: 1,
    suffix: "/5",
    label: "Member rating",
  },
];

function formatMetricValue(value: number, decimals: number) {
  if (decimals > 0) {
    return value.toFixed(decimals);
  }
  return Math.round(value).toLocaleString("es-AR");
}

function useInViewOnce<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return { ref, inView };
}

function useCountUp(target: number, decimals: number, active: boolean) {
  const [value, setValue] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || startedRef.current) {
      return;
    }
    startedRef.current = true;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      const rafId = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(rafId);
    }

    let rafId: number;
    const startTime = performance.now();

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / COUNT_UP_DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 3;
      setValue(target * eased);

      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, target]);

  return formatMetricValue(value, decimals);
}

function MetricStat({ metric, active }: { metric: Metric; active: boolean }) {
  const animatedText = useCountUp(metric.target, metric.decimals, active);
  const finalText = `${metric.prefix ?? ""}${formatMetricValue(metric.target, metric.decimals)}${metric.suffix ?? ""}`;

  return (
    <div>
      <p
        aria-hidden="true"
        className="font-[family-name:var(--font-baloo-2)] text-4xl font-bold text-orange-500 sm:text-5xl"
      >
        {metric.prefix}
        {animatedText}
        {metric.suffix}
      </p>
      <span className="sr-only">{`${finalText} — ${metric.label}`}</span>
      <p className="mt-2 text-sm text-gray-400">{metric.label}</p>
    </div>
  );
}

export function MetricsSection() {
  const { ref, inView } = useInViewOnce<HTMLElement>();

  return (
    <section
      ref={ref}
      className="border-t border-b border-white/10 bg-neutral-800 px-4 py-16 sm:px-6 sm:py-20 lg:py-28"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricStat key={metric.id} metric={metric} active={inView} />
        ))}
      </div>
    </section>
  );
}
