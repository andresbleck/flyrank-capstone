import type { GroqLanguageModelChatOptions } from "@ai-sdk/groq";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  UIMessage,
} from "ai";

import { AI_COACH_SYSTEM_PROMPT } from "@/features/ai-coach/constants";
import { aiCoachModel } from "@/features/ai-coach/lib/groq-provider";
import {
  CalculateMacrosValidationError,
  calculateMacros,
} from "@/features/ai-coach/lib/tools/calculate-macros";

// Without this, Vercel applies its platform default execution limit, which
// can be shorter than a long streamed answer takes to finish — cutting the
// response off mid-sentence instead of a clean completion. Vercel caps this
// to whatever the project's plan allows, so it's safe to ask for more than
// necessary.
export const maxDuration = 60;

// The AI SDK routes both tool errors (e.g. calculateMacros rejecting bad
// input) and provider/stream errors (e.g. an invalid API key) through this
// same callback. Only CalculateMacrosValidationError is known to be safe to
// show verbatim — anything else falls back to a generic message so
// provider/infra details never reach the user.
function streamErrorHandler(error: unknown): string {
  console.error("AI Coach stream error:", error);
  if (error instanceof CalculateMacrosValidationError) return error.message;
  return "The AI coach is unavailable right now.";
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: aiCoachModel,
    system: AI_COACH_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: { calculateMacros },
    // Groq counts hidden reasoning tokens against the same budget as the
    // visible answer, so without an explicit ceiling the default is small
    // enough that long plans get cut off mid-sentence once it's reached.
    maxOutputTokens: 4096,
    providerOptions: {
      groq: {
        // Qwen3 models emit their chain-of-thought as a literal <think>
        // block in the text output unless told otherwise — "hidden" strips
        // it so only the user-facing answer streams to the chat.
        reasoningFormat: "hidden",
        // Thinking mode is on by default ("default") and eats into the
        // same token budget as the visible answer above. Groq only accepts
        // "none" or "default" for this model — "low"/"medium"/"high" are
        // valid for other Groq models but get rejected with a 400 here, so
        // "none" is the only way to give the full budget to the answer.
        reasoningEffort: "none",
      } satisfies GroqLanguageModelChatOptions,
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: streamErrorHandler,
    }),
  });
}
