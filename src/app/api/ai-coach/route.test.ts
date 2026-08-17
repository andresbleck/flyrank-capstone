import { streamText } from "ai";
import type { UIMessage } from "ai";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/ai-coach/route";

vi.mock("ai", async (importOriginal) => {
  const actual = await importOriginal<typeof import("ai")>();
  return {
    ...actual,
    streamText: vi.fn(),
  };
});

vi.mock("@/features/ai-coach/lib/groq-provider", () => ({
  aiCoachModel: {},
}));

const userMessage: UIMessage = {
  id: "u1",
  role: "user",
  parts: [{ type: "text", text: "Hi" }],
};

function streamOf(parts: unknown[]) {
  return new ReadableStream({
    start(controller) {
      for (const part of parts) controller.enqueue(part);
      controller.close();
    },
  });
}

function requestWithBody(body: unknown) {
  return new Request("http://localhost/api/ai-coach", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

function requestWithRawBody(raw: string) {
  return new Request("http://localhost/api/ai-coach", {
    method: "POST",
    body: raw,
  });
}

describe("POST /api/ai-coach", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("streams a 200 response with the SSE content type used by useChat", async () => {
    vi.mocked(streamText).mockReturnValue({
      stream: streamOf([]),
    } as unknown as ReturnType<typeof streamText>);

    const response = await POST(requestWithBody({ messages: [userMessage] }));

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/event-stream");
  });

  it("turns a provider failure into the generic error message, without leaking details", async () => {
    vi.mocked(streamText).mockReturnValue({
      stream: streamOf([
        { type: "error", error: new Error("groq: invalid api key") },
      ]),
    } as unknown as ReturnType<typeof streamText>);

    const response = await POST(requestWithBody({ messages: [userMessage] }));
    const body = await response.text();

    expect(body).toContain("The AI coach is unavailable right now.");
    expect(body).not.toContain("invalid api key");
  });

  it("rejects when the request body is not valid JSON", async () => {
    await expect(
      POST(requestWithRawBody("{not valid json")),
    ).rejects.toThrow();
  });
});
