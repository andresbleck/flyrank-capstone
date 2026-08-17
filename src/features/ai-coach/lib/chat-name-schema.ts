import { z } from "zod";

import { AI_COACH_MAX_NAME_LENGTH } from "@/features/ai-coach/constants";

export const chatNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(
      AI_COACH_MAX_NAME_LENGTH,
      `Name must be ${AI_COACH_MAX_NAME_LENGTH} characters or fewer`,
    ),
});

export type ChatNameInput = z.infer<typeof chatNameSchema>;
