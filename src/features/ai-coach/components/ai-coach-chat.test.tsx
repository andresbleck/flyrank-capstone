import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AiCoachChat } from "@/features/ai-coach/components/ai-coach-chat";
import { AI_COACH_RESUME_MESSAGE } from "@/features/ai-coach/constants";
import {
  ArchivedConversation,
  persistMessages,
  persistName,
  readArchivedConversations,
  readStoredMessages,
  readStoredName,
  startNewConversation,
  switchToConversation,
} from "@/features/ai-coach/hooks/use-chat-local-storage";

vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(),
}));

vi.mock("@/features/ai-coach/hooks/use-chat-local-storage", () => ({
  readStoredMessages: vi.fn(() => []),
  persistMessages: vi.fn(),
  readStoredName: vi.fn(() => null),
  persistName: vi.fn(),
  startNewConversation: vi.fn(),
  readArchivedConversations: vi.fn(() => []),
  switchToConversation: vi.fn(),
}));

const sendMessage = vi.fn();
const setMessages = vi.fn();
const stop = vi.fn();
const regenerate = vi.fn();

const userMessage: UIMessage = {
  id: "u1",
  role: "user",
  parts: [{ type: "text", text: "How do I stay focused?" }],
};

const assistantMessage: UIMessage = {
  id: "a1",
  role: "assistant",
  parts: [{ type: "text", text: "Start with a single small task." }],
};

function mockUseChat(overrides: {
  messages?: UIMessage[];
  status?: "submitted" | "streaming" | "ready" | "error";
  error?: Error;
}) {
  vi.mocked(useChat).mockReturnValue({
    messages: overrides.messages ?? [],
    status: overrides.status ?? "ready",
    error: overrides.error,
    sendMessage,
    setMessages,
    stop,
    regenerate,
    // Fields required by the real hook's type but unused by AiCoachChat.
  } as unknown as ReturnType<typeof useChat>);
}

describe("AiCoachChat", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(readStoredMessages).mockReturnValue([]);
    // Most tests exercise the chat itself, not the name gate — default to a
    // conversation that already has a name, same as a returning visitor.
    vi.mocked(readStoredName).mockReturnValue("Andres");
    vi.mocked(readArchivedConversations).mockReturnValue([]);
  });

  it("asks for a name before showing the chat when none is stored yet", () => {
    vi.mocked(readStoredName).mockReturnValue(null);
    mockUseChat({ status: "ready" });

    render(<AiCoachChat />);

    expect(screen.getByLabelText(/what's your name/i)).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: "" })).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "New conversation" }),
    ).not.toBeInTheDocument();
  });

  it("reveals the chat and remembers the name once the name gate is submitted", async () => {
    const user = userEvent.setup();
    vi.mocked(readStoredName).mockReturnValue(null);
    mockUseChat({ status: "ready" });

    render(<AiCoachChat />);
    await user.type(screen.getByLabelText(/what's your name/i), "Andres");
    await user.click(screen.getByRole("button", { name: "Start chatting" }));

    expect(persistName).toHaveBeenCalledExactlyOnceWith("Andres");
    expect(
      screen.getByPlaceholderText("Ask your AI coach anything..."),
    ).toBeInTheDocument();
  });

  it("archives the current conversation and returns to the name gate on New conversation", async () => {
    const user = userEvent.setup();
    mockUseChat({ messages: [userMessage, assistantMessage], status: "ready" });

    render(<AiCoachChat />);
    await user.click(screen.getByRole("button", { name: "New conversation" }));

    expect(startNewConversation).toHaveBeenCalledExactlyOnceWith("Andres", [
      userMessage,
      assistantMessage,
    ]);
    expect(setMessages).toHaveBeenCalledWith([]);
    expect(screen.getByLabelText(/what's your name/i)).toBeInTheDocument();
  });

  it("shows the History menu once there are archived conversations, and switching restores the selected one", async () => {
    const user = userEvent.setup();
    const archivedLucas: ArchivedConversation = {
      id: "abc",
      name: "Lucas",
      messages: [userMessage],
      endedAt: "2026-08-17T12:00:00.000Z",
    };
    vi.mocked(readArchivedConversations).mockReturnValue([archivedLucas]);
    vi.mocked(switchToConversation).mockReturnValue({
      name: "Lucas",
      messages: [userMessage],
    });
    mockUseChat({ messages: [], status: "ready" });

    render(<AiCoachChat />);
    await user.click(screen.getByRole("button", { name: "History" }));
    await user.click(screen.getByText("Lucas"));

    expect(switchToConversation).toHaveBeenCalledExactlyOnceWith(
      "abc",
      "Andres",
      [],
    );
    // setMessages also fires once on mount (hydration from localStorage),
    // so this checks the switch call happened rather than call count.
    expect(setMessages).toHaveBeenCalledWith([userMessage]);
  });

  it("does not show the History menu when there is nothing archived", () => {
    mockUseChat({ status: "ready" });

    render(<AiCoachChat />);

    expect(
      screen.queryByRole("button", { name: "History" }),
    ).not.toBeInTheDocument();
  });

  it("renders each message and moves focus to the last assistant reply once ready", () => {
    mockUseChat({ messages: [userMessage, assistantMessage], status: "ready" });

    render(<AiCoachChat />);

    expect(screen.getByText("How do I stay focused?")).toBeInTheDocument();
    expect(
      screen.getByText("Start with a single small task."),
    ).toBeInTheDocument();
    // The message text now renders through react-markdown (wrapped in a
    // <p>), so we check the actually-focused element directly instead of
    // asserting focus on an element found by its text.
    expect(document.activeElement).toHaveTextContent(
      "Start with a single small task.",
    );
  });

  it("shows the error message and re-enables the form when the request failed", () => {
    mockUseChat({ status: "error", error: new Error("The AI coach is unavailable right now.") });

    render(<AiCoachChat />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "The AI coach is unavailable right now.",
    );
    expect(screen.getByRole("button", { name: "Send" })).not.toBeDisabled();
  });

  it("retries via regenerate when Retry is clicked after a failed request", async () => {
    const user = userEvent.setup();
    mockUseChat({ status: "error", error: new Error("Request failed") });

    render(<AiCoachChat />);
    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(regenerate).toHaveBeenCalledOnce();
  });

  it("does not show the error banner while a retried response is streaming in, even with a stale error", () => {
    mockUseChat({ status: "streaming", error: new Error("Request failed") });

    render(<AiCoachChat />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows an enabled Stop button while a response is streaming in", async () => {
    const user = userEvent.setup();
    mockUseChat({ messages: [userMessage], status: "streaming" });

    render(<AiCoachChat />);

    const stopButton = screen.getByRole("button", { name: "Stop" });
    expect(stopButton).not.toBeDisabled();
    expect(screen.getByRole("textbox")).toBeDisabled();

    await user.click(stopButton);

    expect(stop).toHaveBeenCalledOnce();
  });

  it("shows a red Resume button after Stop, and resuming asks the model to continue", async () => {
    const user = userEvent.setup();
    mockUseChat({ messages: [userMessage], status: "streaming" });

    const { rerender } = render(<AiCoachChat />);
    await user.click(screen.getByRole("button", { name: "Stop" }));
    expect(stop).toHaveBeenCalledOnce();

    // Simulate the stream having actually stopped after the abort.
    mockUseChat({ messages: [userMessage], status: "ready" });
    rerender(<AiCoachChat />);

    const resumeButton = screen.getByRole("button", { name: "Resume" });
    expect(resumeButton).toHaveClass("bg-red-600");

    await user.click(resumeButton);

    expect(sendMessage).toHaveBeenCalledExactlyOnceWith({
      text: AI_COACH_RESUME_MESSAGE,
    });
  });

  it("sends the typed message through useChat's sendMessage", async () => {
    const user = userEvent.setup();
    mockUseChat({ status: "ready" });

    render(<AiCoachChat />);
    await user.type(screen.getByRole("textbox"), "Any tips for today?");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(sendMessage).toHaveBeenCalledExactlyOnceWith({
      text: "Any tips for today?",
    });
  });

  it("hydrates the conversation from localStorage on mount", () => {
    vi.mocked(readStoredMessages).mockReturnValue([userMessage]);
    mockUseChat({ status: "ready" });

    render(<AiCoachChat />);

    expect(setMessages).toHaveBeenCalledExactlyOnceWith([userMessage]);
  });

  it("persists the conversation once the assistant's reply is fully streamed in", () => {
    mockUseChat({ messages: [userMessage, assistantMessage], status: "ready" });

    render(<AiCoachChat />);

    expect(persistMessages).toHaveBeenCalledExactlyOnceWith([
      userMessage,
      assistantMessage,
    ]);
  });

  it("does not persist while there are no messages yet", () => {
    mockUseChat({ messages: [], status: "ready" });

    render(<AiCoachChat />);

    expect(persistMessages).not.toHaveBeenCalled();
  });

  it("shows a welcome message when the conversation hasn't started yet", () => {
    mockUseChat({ messages: [], status: "ready" });

    render(<AiCoachChat />);

    expect(
      screen.getByText("Welcome to your AI Coach!"),
    ).toBeInTheDocument();
  });

  it("fills the chat input with the clicked example instead of sending it", async () => {
    const user = userEvent.setup();
    mockUseChat({ messages: [], status: "ready" });

    render(<AiCoachChat />);
    await user.click(
      screen.getByRole("button", {
        name: "Build me a beginner gym routine",
      }),
    );

    expect(
      screen.getByPlaceholderText("Ask your AI coach anything..."),
    ).toHaveValue("Build me a beginner gym routine");
    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("shows a typing indicator once the message is submitted, before the first token arrives", () => {
    mockUseChat({ messages: [userMessage], status: "submitted" });

    render(<AiCoachChat />);

    expect(screen.getByText("Coach is typing...")).toBeInTheDocument();
  });
});
