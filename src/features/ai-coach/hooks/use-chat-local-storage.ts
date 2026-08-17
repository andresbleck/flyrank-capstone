import { UIMessage } from "ai";

import { AI_COACH_LOCAL_STORAGE_KEY } from "@/features/ai-coach/constants";

export function readStoredMessages(): UIMessage[] {
  try {
    const raw = localStorage.getItem(AI_COACH_LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UIMessage[]) : [];
  } catch {
    return [];
  }
}

export function persistMessages(messages: UIMessage[]): void {
  try {
    localStorage.setItem(AI_COACH_LOCAL_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded) — ignore.
  }
}
