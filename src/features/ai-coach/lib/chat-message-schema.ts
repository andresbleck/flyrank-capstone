import { z } from "zod";

import { AI_COACH_MAX_MESSAGE_LENGTH } from "@/features/ai-coach/constants";

export const chatMessageSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(
      AI_COACH_MAX_MESSAGE_LENGTH,
      `Message must be ${AI_COACH_MAX_MESSAGE_LENGTH} characters or fewer`,
    ),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
