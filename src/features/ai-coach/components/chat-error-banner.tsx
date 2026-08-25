"use client";

import { SVGProps } from "react";

import { Button } from "@/components/ui/button";

type ChatErrorBannerProps = {
  message: string;
  onRetry: () => void;
  isRetrying: boolean;
};

const RAW_TECHNICAL_MESSAGE_PATTERN = /ERR_[A-Z0-9_]+|Failed to fetch/;
const CURATED_ERROR_MESSAGE = "Something went wrong. Please try again.";

function AlertIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
      />
    </svg>
  );
}

export function ChatErrorBanner({
  message,
  onRetry,
  isRetrying,
}: ChatErrorBannerProps) {
  const displayMessage = RAW_TECHNICAL_MESSAGE_PATTERN.test(message)
    ? CURATED_ERROR_MESSAGE
    : message;

  const handleRetryClick = () => {
    if (isRetrying) return;
    onRetry();
  };

  return (
    <div
      role="alert"
      className="mx-4 mb-2 flex items-center gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200"
    >
      <AlertIcon className="h-5 w-5 shrink-0 text-red-400" />
      <p className="flex-1">{displayMessage}</p>
      <Button
        type="button"
        variant="outline"
        onClick={handleRetryClick}
        disabled={isRetrying}
        aria-busy={isRetrying}
        className="shrink-0"
      >
        Retry
      </Button>
    </div>
  );
}
