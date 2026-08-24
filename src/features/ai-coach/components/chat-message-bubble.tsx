import { forwardRef } from "react";
import { type InferUITool, type ToolUIPart, UIMessage } from "ai";
import Markdown, { type Components } from "react-markdown";

import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { MacroCard } from "@/features/ai-coach/components/macro-card";
import { calculateMacros } from "@/features/ai-coach/lib/tools/calculate-macros";

type ChatMessageBubbleProps = {
  message: UIMessage;
};

type CalculateMacrosUITool = InferUITool<typeof calculateMacros>;

// .filter() on a plain boolean predicate doesn't narrow the array's element
// type, and useChat() here isn't parameterized with this app's tool set, so
// the compiler has no way to know a part.type === "tool-calculateMacros"
// part actually has this shape. Cast once, right after the filter, instead
// of a `.filter(): part is X` predicate that Extract<> can't resolve against
// the default (un-parameterized) UITools type.
type CalculateMacrosPart = ToolUIPart<{ calculateMacros: CalculateMacrosUITool }>;

const GOAL_LABELS: Record<CalculateMacrosUITool["output"]["goal"], string> = {
  lose: "bajar de peso",
  maintain: "mantener",
  gain: "ganar músculo",
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
        {message.parts
          .filter((part) => part.type === "tool-calculateMacros")
          .map((rawPart) => {
            const part = rawPart as CalculateMacrosPart;
            const callId = part.toolCallId;

            switch (part.state) {
              case "input-streaming":
                // part.input can be incomplete in this state — don't read its fields
                return (
                  <div
                    key={`${callId}-${part.state}`}
                    className="flex w-full max-w-sm items-center gap-2 text-sm text-gray-300 animate-[tool-state-fade-in_200ms_ease-out]"
                  >
                    <Spinner />
                    El coach está armando tu consulta…
                  </div>
                );
              case "input-available": {
                const { age, weightKg, heightCm, goal } = part.input;
                return (
                  <div
                    key={`${callId}-${part.state}`}
                    className="w-full max-w-sm rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-gray-200 animate-[tool-state-fade-in_200ms_ease-out]"
                  >
                    Voy a calcular para: {age} años · {weightKg} kg ·{" "}
                    {heightCm} cm · objetivo: {GOAL_LABELS[goal]}
                  </div>
                );
              }
              case "output-available":
                return (
                  <div
                    key={`${callId}-${part.state}`}
                    className="animate-[tool-state-fade-in_200ms_ease-out]"
                  >
                    <MacroCard {...part.output} />
                  </div>
                );
              case "output-error":
                return (
                  <div
                    key={`${callId}-${part.state}`}
                    role="alert"
                    className="w-full max-w-sm rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200 animate-[tool-state-fade-in_200ms_ease-out]"
                  >
                    <p className="font-semibold text-red-300">
                      No se pudo realizar el cálculo. Revisá tus datos e
                      intentá de nuevo.
                    </p>
                    {part.errorText && (
                      <p className="mt-1 font-mono text-xs text-red-400/80">
                        {part.errorText}
                      </p>
                    )}
                  </div>
                );
              case "approval-requested":
              case "approval-responded":
              case "output-denied":
                return null;
            }
          })}
      </div>
    </div>
  );
});
