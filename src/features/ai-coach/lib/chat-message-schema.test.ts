import { describe, expect, it } from "vitest";

import {
  chatMessageSchema,
} from "@/features/ai-coach/lib/chat-message-schema";
import { AI_COACH_MAX_MESSAGE_LENGTH } from "@/features/ai-coach/constants";

describe("chatMessageSchema", () => {
  it("accepts a valid message and trims surrounding whitespace", () => {
    const result = chatMessageSchema.safeParse({ content: "  hello coach  " });

    expect(result.success).toBe(true);
    expect(result.success && result.data.content).toBe("hello coach");
  });

  it("rejects an empty message", () => {
    const result = chatMessageSchema.safeParse({ content: "" });

    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only message after trimming", () => {
    const result = chatMessageSchema.safeParse({ content: "   " });

    expect(result.success).toBe(false);
  });

  it("rejects a message longer than the max length", () => {
    const tooLong = "a".repeat(AI_COACH_MAX_MESSAGE_LENGTH + 1);

    const result = chatMessageSchema.safeParse({ content: tooLong });

    expect(result.success).toBe(false);
  });

  it("accepts a message exactly at the max length", () => {
    const exact = "a".repeat(AI_COACH_MAX_MESSAGE_LENGTH);

    const result = chatMessageSchema.safeParse({ content: exact });

    expect(result.success).toBe(true);
  });
});
