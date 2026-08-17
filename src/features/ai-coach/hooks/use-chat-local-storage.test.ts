import type { UIMessage } from "ai";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AI_COACH_LOCAL_STORAGE_KEY } from "@/features/ai-coach/constants";
import {
  persistMessages,
  readStoredMessages,
} from "@/features/ai-coach/hooks/use-chat-local-storage";

const storedMessage: UIMessage = {
  id: "u1",
  role: "user",
  parts: [{ type: "text", text: "Hello" }],
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
