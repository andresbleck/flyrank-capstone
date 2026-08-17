import { RefObject, useEffect, useRef } from "react";
import { UIMessage } from "ai";

import { Spinner } from "@/components/ui/spinner";
import { ChatMessageBubble } from "@/features/ai-coach/components/chat-message-bubble";

// How close to the bottom (in pixels) still counts as "at the bottom" for
// auto-scroll purposes — matches typical chat UI tolerance for sub-pixel
// rounding and the tiny gap that can appear while content is still painting.
const AUTO_SCROLL_THRESHOLD_PX = 100;

type ChatMessageListProps = {
  messages: UIMessage[];
  lastAssistantMessageRef: RefObject<HTMLDivElement | null>;
  isWaitingForReply: boolean;
};

export function ChatMessageList({
  messages,
  lastAssistantMessageRef,
  isWaitingForReply,
}: ChatMessageListProps) {
  const lastAssistantMessageId = [...messages]
    .reverse()
    .find((message) => message.role === "assistant")?.id;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Tracks whether the user is currently near the bottom of the list. Starts
  // true so the list scrolls down as the first messages arrive.
  const isNearBottomRef = useRef(true);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottomRef.current = distanceFromBottom <= AUTO_SCROLL_THRESHOLD_PX;
  };

  // Only auto-scroll to the new content if the user was already near the
  // bottom — if they scrolled up to read earlier messages, leave them there.
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && isNearBottomRef.current) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, isWaitingForReply]);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      role="log"
      aria-live="polite"
      className="flex flex-1 flex-col gap-2 overflow-y-auto p-4"
    >
      {messages.length === 0 && (
        <p className="m-auto max-w-sm text-center text-sm text-gray-300">
          Ask about your training, nutrition, or habits — I&apos;ll ask what I
          need to know first.
        </p>
      )}
      {messages.map((message) => (
        <ChatMessageBubble
          key={message.id}
          message={message}
          ref={message.id === lastAssistantMessageId ? lastAssistantMessageRef : undefined}
        />
      ))}
      {isWaitingForReply && (
        <div className="flex items-center gap-2 self-start text-sm text-gray-300">
          <Spinner />
          Coach is typing...
        </div>
      )}
    </div>
  );
}
