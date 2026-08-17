// Model, system prompt, and related config for the AI Coach feature, kept
// together so the assistant's behavior can be tuned from a single place.
// The model is actually instantiated in `lib/groq-provider.ts` (server-only,
// imported only by the API route) — this file only holds the ID/config
// values, not the Groq client itself.

export const AI_COACH_API_PATH = "/api/ai-coach";

// qwen/qwen3.6-27b: fast, streams well. Note it's a Groq "preview" model
// (not guaranteed for production, can be deprecated without much notice) —
// if it ever 404s or gets pulled, fall back to "openai/gpt-oss-20b" plus
// providerOptions.groq.reasoningEffort: "low" in route.ts, the last
// known-good non-preview setup. Also relies on reasoningFormat: "hidden" in
// route.ts, or its <think> reasoning block leaks into the visible text.
// Originally used llama-3.3-70b-versatile, but Groq retired it from this
// account's model catalog — check the Playground's model dropdown at
// console.groq.com if this ever 404s again ("model does not exist or you
// do not have access to it" means the catalog changed, not a code bug).
export const AI_COACH_MODEL_ID = "qwen/qwen3.6-27b";

// Instructs the model to gather the user's goal/weight/height/activity level
// before recommending a plan, instead of answering generically on the first
// message. This is a soft instruction (the model can still skip it), not a
// hard requirement enforced in code.
export const AI_COACH_SYSTEM_PROMPT = `You are a supportive, practical fitness and habits coach. Keep answers concise and actionable.

Before giving a workout, nutrition, or habit plan, ask the user for the context you need to tailor it: their goal, current weight and height, activity level, and whether they already exercise. Ask only what's missing — don't re-ask what the user already told you, and don't interrogate them before every single message once you already have the basics. If the user insists on a recommendation without providing this context, give a general one but note that it would improve with more details.

Format plans with nested Markdown lists (headings, bullets, bold), never with tables or raw HTML tags like <br> — the chat display can't render those.`;

export const AI_COACH_LOCAL_STORAGE_KEY = "ai-coach:messages";

// Sent as a regular user message when Resume is clicked after Stop, so the
// model keeps writing the same answer instead of starting a new one. This
// shows up as a normal chat bubble — there's no hidden-message plumbing.
export const AI_COACH_RESUME_MESSAGE =
  "Continue exactly where you left off — don't repeat anything you already said.";

// Caps how much a single message can cost to generate a response for.
export const AI_COACH_MAX_MESSAGE_LENGTH = 2000;
