import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
  UIMessage,
} from "ai";

import { AI_COACH_SYSTEM_PROMPT } from "@/features/ai-coach/constants";
import { aiCoachModel } from "@/features/ai-coach/lib/groq-provider";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: aiCoachModel,
    system: AI_COACH_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
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
