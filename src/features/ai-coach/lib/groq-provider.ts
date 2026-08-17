import { groq } from "@ai-sdk/groq";

import { AI_COACH_MODEL_ID } from "@/features/ai-coach/constants";

export const aiCoachModel = groq(AI_COACH_MODEL_ID);
