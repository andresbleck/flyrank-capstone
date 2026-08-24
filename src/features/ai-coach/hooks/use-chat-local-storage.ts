import { UIMessage } from "ai";

import {
  AI_COACH_ARCHIVE_STORAGE_KEY,
  AI_COACH_LOCAL_STORAGE_KEY,
  AI_COACH_NAME_STORAGE_KEY,
} from "@/features/ai-coach/constants";

export type ArchivedConversation = {
  id: string;
  name: string;
  messages: UIMessage[];
  endedAt: string;
};

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

export function readStoredName(): string | null {
  try {
    return localStorage.getItem(AI_COACH_NAME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistName(name: string): void {
  try {
    localStorage.setItem(AI_COACH_NAME_STORAGE_KEY, name);
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded) — ignore.
  }
}

export function readArchivedConversations(): ArchivedConversation[] {
  try {
    const raw = localStorage.getItem(AI_COACH_ARCHIVE_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Conversations archived before `id` existed on this type don't have
    // one — back-fill and persist so it's stable across reads instead of
    // getting a new id (and breaking switchToConversation's lookup) every
    // time this runs.
    let hasLegacyEntry = false;
    const conversations = (parsed as Partial<ArchivedConversation>[]).map(
      (conversation) => {
        if (conversation.id) return conversation as ArchivedConversation;
        hasLegacyEntry = true;
        return { ...conversation, id: crypto.randomUUID() } as ArchivedConversation;
      },
    );

    if (hasLegacyEntry) {
      localStorage.setItem(
        AI_COACH_ARCHIVE_STORAGE_KEY,
        JSON.stringify(conversations),
      );
    }

    return conversations;
  } catch {
    return [];
  }
}

// Used by the history menu's delete button: removes one archived
// conversation permanently. Returns the updated list so callers can sync
// their state without a second read.
export function deleteArchivedConversation(id: string): ArchivedConversation[] {
  try {
    const list = readArchivedConversations().filter(
      (conversation) => conversation.id !== id,
    );
    localStorage.setItem(AI_COACH_ARCHIVE_STORAGE_KEY, JSON.stringify(list));
    return list;
  } catch {
    return readArchivedConversations();
  }
}

function archive(conversation: Omit<ArchivedConversation, "id" | "endedAt">) {
  const list = readArchivedConversations();
  list.push({
    ...conversation,
    id: crypto.randomUUID(),
    endedAt: new Date().toISOString(),
  });
  localStorage.setItem(AI_COACH_ARCHIVE_STORAGE_KEY, JSON.stringify(list));
}

// Used by "New conversation": archives the current conversation under its
// name (if it has any messages) and clears the active conversation, so the
// next person starts from zero without seeing what came before.
export function startNewConversation(name: string, messages: UIMessage[]): void {
  try {
    if (messages.length > 0) {
      archive({ name, messages });
    }
    localStorage.removeItem(AI_COACH_LOCAL_STORAGE_KEY);
    localStorage.removeItem(AI_COACH_NAME_STORAGE_KEY);
  } catch {
    // localStorage may be unavailable (private browsing, quota exceeded) — ignore.
  }
}

// Used by the history menu: restores an archived conversation as the active
// one. Whatever was active before it gets archived in its place (if it had
// any messages), so switching away from an in-progress conversation never
// silently loses it. Returns null if the id wasn't found (shouldn't happen
// in normal use, but the list is user-facing data, not trusted input).
export function switchToConversation(
  id: string,
  currentName: string,
  currentMessages: UIMessage[],
): { name: string; messages: UIMessage[] } | null {
  try {
    const list = readArchivedConversations();
    const index = list.findIndex((conversation) => conversation.id === id);
    if (index === -1) return null;

    const [restored] = list.splice(index, 1);
    localStorage.setItem(AI_COACH_ARCHIVE_STORAGE_KEY, JSON.stringify(list));

    if (currentMessages.length > 0) {
      archive({ name: currentName, messages: currentMessages });
    }

    localStorage.setItem(
      AI_COACH_LOCAL_STORAGE_KEY,
      JSON.stringify(restored.messages),
    );
    localStorage.setItem(AI_COACH_NAME_STORAGE_KEY, restored.name);

    return { name: restored.name, messages: restored.messages };
  } catch {
    return null;
  }
}
