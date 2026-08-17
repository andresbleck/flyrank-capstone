import { describe, expect, it } from "vitest";

import { chatNameSchema } from "@/features/ai-coach/lib/chat-name-schema";
import { AI_COACH_MAX_NAME_LENGTH } from "@/features/ai-coach/constants";

describe("chatNameSchema", () => {
  it("accepts a valid name and trims surrounding whitespace", () => {
    const result = chatNameSchema.safeParse({ name: "  Andres  " });

    expect(result.success).toBe(true);
    expect(result.success && result.data.name).toBe("Andres");
  });

  it("rejects an empty name", () => {
    const result = chatNameSchema.safeParse({ name: "" });

    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only name after trimming", () => {
    const result = chatNameSchema.safeParse({ name: "   " });

    expect(result.success).toBe(false);
  });

  it("rejects a name longer than the max length", () => {
    const tooLong = "a".repeat(AI_COACH_MAX_NAME_LENGTH + 1);

    const result = chatNameSchema.safeParse({ name: tooLong });

    expect(result.success).toBe(false);
  });

  it("accepts a name exactly at the max length", () => {
    const exact = "a".repeat(AI_COACH_MAX_NAME_LENGTH);

    const result = chatNameSchema.safeParse({ name: exact });

    expect(result.success).toBe(true);
  });
});
