import { forwardRef } from "react";
import { UIMessage } from "ai";
import Markdown, { type Components } from "react-markdown";

import { Avatar } from "@/components/ui/avatar";

type ChatMessageBubbleProps = {
  message: UIMessage;
};

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => (
    <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  h1: ({ children }) => <h3 className="mb-1 font-semibold">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-1 font-semibold">{children}</h3>,
  h3: ({ children }) => <h3 className="mb-1 font-semibold">{children}</h3>,
  a: ({ children, href }) => (
    <a href={href} target="_blank" rel="noreferrer" className="underline">
      {children}
    </a>
  ),
};

export const ChatMessageBubble = forwardRef<
  HTMLDivElement,
  ChatMessageBubbleProps
>(function ChatMessageBubble({ message }, ref) {
  const isUser = message.role === "user";
  const text = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");

  return (
    <div
      className={`flex max-w-[80%] items-end gap-2 ${
        isUser ? "self-end flex-row-reverse" : "self-start"
      }`}
    >
      <Avatar initials={isUser ? "T" : "C"} variant={isUser ? "user" : "assistant"} />
      <div>
        <span className="sr-only">{isUser ? "You said:" : "Coach said:"}</span>
        <div
          ref={ref}
          tabIndex={-1}
          className={`break-words rounded-lg px-3 py-2 text-sm ${
            isUser
              ? "whitespace-pre-wrap bg-orange-600 text-white"
              : "bg-white/10 text-white backdrop-blur-sm"
          }`}
        >
          {isUser ? (
            text
          ) : (
            <Markdown components={markdownComponents}>{text}</Markdown>
          )}
        </div>
        {/* TEMPORARY (Phase 2): remove in Phase 3 */}
        {message.parts
          .filter((part) => part.type.startsWith("tool-"))
          .map((part, index) => (
            <pre key={`${part.type}-${index}`}>
              {JSON.stringify(part, null, 2)}
            </pre>
          ))}
      </div>
    </div>
  );
});
