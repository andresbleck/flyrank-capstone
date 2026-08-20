"use client";

import { useSyncExternalStore } from "react";

interface ShutterTextProps {
  text?: string;
}

const SLICE_DELAY_STEP_MS = 90;
const SLICE_ACCENT_CLASS = "text-[#ff5c1a] drop-shadow-[0_0_10px_rgba(255,92,26,0.85)]";
const REDUCE_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(onChange: () => void) {
  const mediaQueryList = window.matchMedia(REDUCE_MOTION_QUERY);
  mediaQueryList.addEventListener("change", onChange);
  return () => mediaQueryList.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCE_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return true;
}

export function ShutterText({ text = "FORGE" }: ShutterTextProps) {
  const reduceMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );

  const characters = text.split("");

  return (
    <span aria-hidden="true" className="inline-flex">
      {characters.map((char, index) => {
        const display = char === " " ? " " : char;
        const delay = `${index * SLICE_DELAY_STEP_MS}ms`;

        return (
          <span key={index} className="relative inline-block overflow-hidden">
            <span
              data-shutter-base="true"
              className={
                reduceMotion
                  ? "opacity-100"
                  : "animate-[shutter-fade-blur_1.6s_ease-out_forwards] opacity-0"
              }
              style={reduceMotion ? undefined : { animationDelay: delay }}
            >
              {display}
            </span>

            {!reduceMotion && (
              <>
                <span
                  className={`absolute inset-0 animate-[shutter-slice-right_1.4s_ease-in-out_forwards] opacity-0 [clip-path:polygon(0_0,100%_0,100%_35%,0_35%)] ${SLICE_ACCENT_CLASS}`}
                  style={{ animationDelay: delay }}
                >
                  {display}
                </span>
                <span
                  className="absolute inset-0 animate-[shutter-slice-left_1.4s_ease-in-out_forwards] text-white opacity-0 [clip-path:polygon(0_35%,100%_35%,100%_65%,0_65%)]"
                  style={{ animationDelay: `${index * SLICE_DELAY_STEP_MS + 120}ms` }}
                >
                  {display}
                </span>
                <span
                  className={`absolute inset-0 animate-[shutter-slice-right_1.4s_ease-in-out_forwards] opacity-0 [clip-path:polygon(0_65%,100%_65%,100%_100%,0_100%)] ${SLICE_ACCENT_CLASS}`}
                  style={{ animationDelay: `${index * SLICE_DELAY_STEP_MS + 240}ms` }}
                >
                  {display}
                </span>
              </>
            )}
          </span>
        );
      })}
    </span>
  );
}
