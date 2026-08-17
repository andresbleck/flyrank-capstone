import type { UIMessage } from "ai";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  AI_COACH_ARCHIVE_STORAGE_KEY,
  AI_COACH_LOCAL_STORAGE_KEY,
} from "@/features/ai-coach/constants";
import {
  persistMessages,
  persistName,
  readArchivedConversations,
  readStoredMessages,
  readStoredName,
  startNewConversation,
  switchToConversation,
} from "@/features/ai-coach/hooks/use-chat-local-storage";

const storedMessage: UIMessage = {
  id: "u1",
  role: "user",
  parts: [{ type: "text", text: "Hello" }],
};

const otherMessage: UIMessage = {
  id: "u2",
  role: "user",
  parts: [{ type: "text", text: "Hi again" }],
};

describe("readStoredMessages", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns the previously stored history", () => {
    localStorage.setItem(
      AI_COACH_LOCAL_STORAGE_KEY,
      JSON.stringify([storedMessage]),
    );

    expect(readStoredMessages()).toEqual([storedMessage]);
  });

  it("returns an empty array when nothing is stored", () => {
    expect(readStoredMessages()).toEqual([]);
  });

  it("returns an empty array when the stored value is corrupted JSON", () => {
    localStorage.setItem(AI_COACH_LOCAL_STORAGE_KEY, "{not valid json");

    expect(readStoredMessages()).toEqual([]);
  });

  it("returns an empty array when the stored value is not an array", () => {
    localStorage.setItem(
      AI_COACH_LOCAL_STORAGE_KEY,
      JSON.stringify({ oops: true }),
    );

    expect(readStoredMessages()).toEqual([]);
  });
});

describe("persistMessages", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("writes the messages under the expected key", () => {
    persistMessages([storedMessage]);

    expect(localStorage.getItem(AI_COACH_LOCAL_STORAGE_KEY)).toBe(
      JSON.stringify([storedMessage]),
    );
  });

  it("does not throw when localStorage.setItem fails", () => {
    const setItemSpy = vi
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation(() => {
        throw new Error("QuotaExceededError");
      });

    expect(() => persistMessages([storedMessage])).not.toThrow();

    setItemSpy.mockRestore();
  });
});

describe("readStoredName / persistName", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null when no name is stored", () => {
    expect(readStoredName()).toBeNull();
  });

  it("returns the previously stored name", () => {
    persistName("Andres");

    expect(readStoredName()).toBe("Andres");
  });
});

describe("readArchivedConversations", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns an empty array when nothing is archived", () => {
    expect(readArchivedConversations()).toEqual([]);
  });

  it("returns an empty array when the stored value is corrupted JSON", () => {
    localStorage.setItem(AI_COACH_ARCHIVE_STORAGE_KEY, "{not valid json");

    expect(readArchivedConversations()).toEqual([]);
  });

  it("back-fills a missing id on legacy entries and persists it as stable", () => {
    localStorage.setItem(
      AI_COACH_ARCHIVE_STORAGE_KEY,
      JSON.stringify([
        { name: "Andres", messages: [storedMessage], endedAt: "2026-08-01T00:00:00.000Z" },
      ]),
    );

    const [first] = readArchivedConversations();
    expect(first.id).toBeTruthy();

    const [second] = readArchivedConversations();
    expect(second.id).toBe(first.id);
  });
});

describe("startNewConversation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("archives the current conversation under its name and clears the active one", () => {
    localStorage.setItem(
      AI_COACH_LOCAL_STORAGE_KEY,
      JSON.stringify([storedMessage]),
    );
    persistName("Andres");

    startNewConversation("Andres", [storedMessage]);

    const archive = readArchivedConversations();
    expect(archive).toHaveLength(1);
    expect(archive[0].name).toBe("Andres");
    expect(archive[0].messages).toEqual([storedMessage]);
    expect(readStoredMessages()).toEqual([]);
    expect(readStoredName()).toBeNull();
  });

  it("appends to, rather than overwrites, previously archived conversations", () => {
    startNewConversation("Andres", [storedMessage]);
    startNewConversation("Lucas", [storedMessage]);

    const archive = readArchivedConversations();
    expect(archive.map((conversation) => conversation.name)).toEqual([
      "Andres",
      "Lucas",
    ]);
  });

  it("does not archive an empty conversation, but still clears the active state", () => {
    persistName("Andres");

    startNewConversation("Andres", []);

    expect(readArchivedConversations()).toEqual([]);
    expect(readStoredName()).toBeNull();
  });

  it("gives each archived conversation a unique id", () => {
    startNewConversation("Andres", [storedMessage]);
    startNewConversation("Lucas", [storedMessage]);

    const [first, second] = readArchivedConversations();
    expect(first.id).not.toBe(second.id);
  });
});

describe("switchToConversation", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("restores an archived conversation as the active one", () => {
    startNewConversation("Andres", [storedMessage]);
    const [archived] = readArchivedConversations();

    const result = switchToConversation(archived.id, "", []);

    expect(result).toEqual({ name: "Andres", messages: [storedMessage] });
    expect(readStoredName()).toBe("Andres");
    expect(readStoredMessages()).toEqual([storedMessage]);
    expect(readArchivedConversations()).toEqual([]);
  });

  it("archives the currently active conversation before switching away from it", () => {
    startNewConversation("Andres", [storedMessage]);
    const [archived] = readArchivedConversations();

    switchToConversation(archived.id, "Lucas", [otherMessage]);

    const remaining = readArchivedConversations();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].name).toBe("Lucas");
    expect(remaining[0].messages).toEqual([otherMessage]);
  });

  it("does not archive the outgoing conversation if it has no messages", () => {
    startNewConversation("Andres", [storedMessage]);
    const [archived] = readArchivedConversations();

    switchToConversation(archived.id, "Lucas", []);

    expect(readArchivedConversations()).toEqual([]);
  });

  it("returns null and changes nothing when the id doesn't exist", () => {
    const result = switchToConversation("missing-id", "Lucas", [otherMessage]);

    expect(result).toBeNull();
    expect(readStoredName()).toBeNull();
    expect(readStoredMessages()).toEqual([]);
  });
});
