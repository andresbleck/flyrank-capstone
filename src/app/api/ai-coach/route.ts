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

// Without this, Vercel applies its platform default execution limit, which
// can be shorter than a long streamed answer takes to finish — cutting the
// response off mid-sentence instead of a clean completion. Vercel caps this
// to whatever the project's plan allows, so it's safe to ask for more than
// necessary.
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: aiCoachModel,
    system: AI_COACH_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    // Qwen3 models emit their chain-of-thought as a literal <think> block in
    // the text output unless told otherwise — "hidden" strips it so only the
    // user-facing answer streams to the chat.
    providerOptions: {
      groq: {
        reasoningFormat: "hidden",
      } satisfies GroqLanguageModelChatOptions,
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        console.error("AI Coach stream error:", error);
        return "The AI coach is unavailable right now.";
      },
    }),
  });
}
