import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChatErrorBanner } from "@/features/ai-coach/components/chat-error-banner";

describe("ChatErrorBanner", () => {
  it("shows a curated error message as-is when it already reads as user-friendly text", () => {
    render(
      <ChatErrorBanner
        message="The AI coach is unavailable right now."
        onRetry={vi.fn()}
        isRetrying={false}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The AI coach is unavailable right now.",
    );
  });

  it("replaces a raw browser network error with a curated message", () => {
    render(
      <ChatErrorBanner
        message="net::ERR_INCOMPLETE_CHUNKED_ENCODING"
        onRetry={vi.fn()}
        isRetrying={false}
      />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).not.toHaveTextContent("ERR_INCOMPLETE_CHUNKED_ENCODING");
    expect(alert).toHaveTextContent("Something went wrong. Please try again.");
  });

  it("calls onRetry when the Retry button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <ChatErrorBanner message="Failed" onRetry={onRetry} isRetrying={false} />,
    );

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("disables the Retry button and ignores clicks while retrying", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <ChatErrorBanner message="Failed" onRetry={onRetry} isRetrying={true} />,
    );

    const retryButton = screen.getByRole("button", { name: "Retry" });
    expect(retryButton).toBeDisabled();

    await user.click(retryButton);

    expect(onRetry).not.toHaveBeenCalled();
  });
});
