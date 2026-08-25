"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type AiCoachErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const ERROR_MESSAGE = "We couldn't load the AI coach. Please try again.";

export default function AiCoachError({ error, reset }: AiCoachErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="flex flex-1 flex-col items-center justify-center gap-4 bg-neutral-900 p-4 text-center"
    >
      <h1 className="font-[family-name:var(--font-changa-one)] text-xl tracking-tight text-orange-500 uppercase">
        Something went wrong
      </h1>
      <p className="max-w-md text-sm text-gray-300">{ERROR_MESSAGE}</p>
      <Button type="button" variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
