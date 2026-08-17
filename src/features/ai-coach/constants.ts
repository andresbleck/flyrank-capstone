// Model, system prompt, and related config for the AI Coach feature, kept
// together so the assistant's behavior can be tuned from a single place.
// The model is actually instantiated in `lib/groq-provider.ts` (server-only,
// imported only by the API route) — this file only holds the ID/config
// values, not the Groq client itself.

export const AI_COACH_API_PATH = "/api/ai-coach";

// llama-3.3-70b-versatile: Groq's general-purpose chat model. Chosen for a
// good balance of response quality and latency for a conversational coach —
// see console.groq.com/docs/models for other options if this needs revisiting.
export const AI_COACH_MODEL_ID = "llama-3.3-70b-versatile";

// Instructs the model to gather the user's goal/weight/height/activity level
// before recommending a plan, instead of answering generically on the first
// message. This is a soft instruction (the model can still skip it), not a
// hard requirement enforced in code.
export const AI_COACH_SYSTEM_PROMPT = `You are a supportive, practical fitness and habits coach. Keep answers concise and actionable.

Before giving a workout, nutrition, or habit plan, ask the user for the context you need to tailor it: their goal, current weight and height, activity level, and whether they already exercise. Ask only what's missing — don't re-ask what the user already told you, and don't interrogate them before every single message once you already have the basics. If the user insists on a recommendation without providing this context, give a general one but note that it would improve with more details.`;

export const AI_COACH_LOCAL_STORAGE_KEY = "ai-coach:messages";

// Caps how much a single message can cost to generate a response for.
export const AI_COACH_MAX_MESSAGE_LENGTH = 2000;
