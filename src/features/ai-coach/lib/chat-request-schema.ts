import { z } from "zod";

import { AI_COACH_MAX_MESSAGES_PER_REQUEST } from "@/features/ai-coach/constants";
import { chatMessageSchema } from "@/features/ai-coach/lib/chat-message-schema";

// Server-side gate for POST /api/ai-coach. The client validates the textarea
// with `chatMessageSchema` before sending, but nothing stops a direct POST to
// the route — this re-checks the same rules where they can't be bypassed.
//
// Deliberately loose: it models only what the route needs to trust (roles and
// the text of user messages), not the full `UIMessage` shape. Tool parts carry
// fields like `toolCallId`, `state` and `output` that must survive untouched,
// so every object here is a `looseObject` and the route forwards the ORIGINAL
// body to the model rather than this schema's parsed output. `DefaultChatTransport`
// also sends `id`, `trigger` and `messageId` alongside `messages`; those pass
// through for the same reason.

const messagePartSchema = z.looseObject({
  type: z.string(),
  text: z.string().optional(),
});

// "system" is deliberately absent. The coach's instructions are injected
// server-side by the route (`system: AI_COACH_SYSTEM_PROMPT`) and must never
// come from the request — a client-supplied system message would let a direct
// POST rewrite the coach's behavior. `UIMessage` allows the role, so this is
// narrower than the SDK's type on purpose.
const uiMessageSchema = z.looseObject({
  role: z.enum(["user", "assistant"]),
  parts: z.array(messagePartSchema),
});

type ValidatedMessage = z.infer<typeof uiMessageSchema>;

// A message's visible text is spread across its parts; only the text ones
// count toward the length rule.
function textOf(message: ValidatedMessage): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text ?? "")
    .join("");
}

// The length rule applies to user messages only. Assistant replies are capped
// separately by `maxOutputTokens: 4096` in the route, which is far more than
// 2000 characters, and a message holding just a tool part has no text at all —
// checking either against `chatMessageSchema` would reject legitimate history.
function validateUserMessages(
  messages: ValidatedMessage[],
  ctx: z.RefinementCtx,
): void {
  messages.forEach((message, index) => {
    if (message.role !== "user") return;

    const result = chatMessageSchema.safeParse({ content: textOf(message) });
    if (result.success) return;

    ctx.addIssue({
      code: "custom",
      path: ["messages", index],
      message: result.error.issues[0]?.message ?? "Invalid message.",
    });
  });
}

export const chatRequestSchema = z.looseObject({
  messages: z
    .array(uiMessageSchema)
    .min(1, "Request must include at least one message.")
    .max(
      AI_COACH_MAX_MESSAGES_PER_REQUEST,
      `Request must include ${AI_COACH_MAX_MESSAGES_PER_REQUEST} messages or fewer`,
    )
    .superRefine(validateUserMessages),
});
