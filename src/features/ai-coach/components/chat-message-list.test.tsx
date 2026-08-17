import { createRef } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import type { UIMessage } from "ai";
import { describe, expect, it } from "vitest";

import { ChatMessageList } from "@/features/ai-coach/components/chat-message-list";

// jsdom doesn't lay out content, so scrollHeight/clientHeight are always 0.
// Override them per test to simulate a scrollable container.
function mockScrollMetrics(
  element: HTMLElement,
  { scrollHeight, clientHeight }: { scrollHeight: number; clientHeight: number },
) {
  Object.defineProperty(element, "scrollHeight", {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(element, "clientHeight", {
    value: clientHeight,
    configurable: true,
  });
}

const userMessage: UIMessage = {
  id: "u1",
  role: "user",
  parts: [{ type: "text", text: "How do I stay focused?" }],
};

const assistantMessage: UIMessage = {
  id: "a1",
  role: "assistant",
  parts: [{ type: "text", text: "Start with a single small task." }],
};

describe("ChatMessageList auto-scroll", () => {
  it("scrolls to the bottom as messages arrive while the user is at the bottom", () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <ChatMessageList
        messages={[userMessage]}
        lastAssistantMessageRef={ref}
        isWaitingForReply={false}
      />,
    );

    const container = screen.getByRole("log");
    mockScrollMetrics(container, { scrollHeight: 500, clientHeight: 200 });

    rerender(
      <ChatMessageList
        messages={[userMessage, assistantMessage]}
        lastAssistantMessageRef={ref}
        isWaitingForReply={false}
      />,
    );

    expect(container.scrollTop).toBe(500);
  });

  it("does not force-scroll when the user has scrolled up to read earlier messages", () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <ChatMessageList
        messages={[userMessage]}
        lastAssistantMessageRef={ref}
        isWaitingForReply={false}
      />,
    );

    const container = screen.getByRole("log");
    // Simulate the user scrolling up, away from the bottom.
    mockScrollMetrics(container, { scrollHeight: 1000, clientHeight: 200 });
    container.scrollTop = 0;
    fireEvent.scroll(container);

    // New content arrives while the user is still reading up above.
    mockScrollMetrics(container, { scrollHeight: 1200, clientHeight: 200 });
    rerender(
      <ChatMessageList
        messages={[userMessage, assistantMessage]}
        lastAssistantMessageRef={ref}
        isWaitingForReply={false}
      />,
    );

    expect(container.scrollTop).toBe(0);
  });

  it("resumes auto-scrolling once the user scrolls back near the bottom", () => {
    const ref = createRef<HTMLDivElement>();
    const { rerender } = render(
      <ChatMessageList
        messages={[userMessage]}
        lastAssistantMessageRef={ref}
        isWaitingForReply={false}
      />,
    );

    const container = screen.getByRole("log");
    mockScrollMetrics(container, { scrollHeight: 1000, clientHeight: 200 });
    container.scrollTop = 0;
    fireEvent.scroll(container);

    // User scrolls back down, within the "near bottom" threshold.
    mockScrollMetrics(container, { scrollHeight: 1000, clientHeight: 200 });
    container.scrollTop = 850;
    fireEvent.scroll(container);

    mockScrollMetrics(container, { scrollHeight: 1200, clientHeight: 200 });
    rerender(
      <ChatMessageList
        messages={[userMessage, assistantMessage]}
        lastAssistantMessageRef={ref}
        isWaitingForReply={false}
      />,
    );

    expect(container.scrollTop).toBe(1200);
  });
});
