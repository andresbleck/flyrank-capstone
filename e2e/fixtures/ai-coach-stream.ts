import type { UIMessageChunk } from "ai";

/**
 * Builds a fake UI message stream body in the exact SSE format the AI SDK
 * client (`DefaultChatTransport` / `useChat`) expects from `/api/ai-coach`,
 * so Playwright can mock the route without ever calling the real model.
 */
export function buildAiCoachStreamBody(text: string): string {
  const chunks: UIMessageChunk[] = [
    { type: "start", messageId: "e2e-assistant-1" },
    { type: "start-step" },
    { type: "text-start", id: "e2e-text-1" },
    { type: "text-delta", id: "e2e-text-1", delta: text },
    { type: "text-end", id: "e2e-text-1" },
    { type: "finish-step" },
    { type: "finish" },
  ];

  const events = chunks.map((chunk) => `data: ${JSON.stringify(chunk)}\n\n`);
  events.push("data: [DONE]\n\n");

  return events.join("");
}
