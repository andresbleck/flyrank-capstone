import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChatInputForm } from "@/features/ai-coach/components/chat-input-form";
import { AI_COACH_MAX_MESSAGE_LENGTH } from "@/features/ai-coach/constants";

describe("ChatInputForm", () => {
  it("calls onSubmit with the trimmed message and clears the field", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ChatInputForm onSubmit={onSubmit} onStop={vi.fn()} isStreaming={false} />,
    );

    const textbox = screen.getByRole("textbox");
    await user.type(textbox, "  hello coach  ");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(onSubmit).toHaveBeenCalledExactlyOnceWith("hello coach");
    expect(textbox).toHaveValue("");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows a validation error and does not submit when the message is empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ChatInputForm onSubmit={onSubmit} onStop={vi.fn()} isStreaming={false} />,
    );

    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Message cannot be empty");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("shows a validation error and does not submit when the message is only whitespace", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ChatInputForm onSubmit={onSubmit} onStop={vi.fn()} isStreaming={false} />,
    );

    await user.type(screen.getByRole("textbox"), "     ");
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows a validation error and does not submit when the message is too long", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ChatInputForm onSubmit={onSubmit} onStop={vi.fn()} isStreaming={false} />,
    );

    const tooLong = "a".repeat(AI_COACH_MAX_MESSAGE_LENGTH + 1);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: tooLong } });
    await user.click(screen.getByRole("button", { name: "Send" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("sends the message when Enter is pressed without Shift", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ChatInputForm onSubmit={onSubmit} onStop={vi.fn()} isStreaming={false} />,
    );

    const textbox = screen.getByRole("textbox");
    await user.type(textbox, "hello coach{Enter}");

    expect(onSubmit).toHaveBeenCalledExactlyOnceWith("hello coach");
  });

  it("adds a new line instead of submitting when Shift+Enter is pressed", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <ChatInputForm onSubmit={onSubmit} onStop={vi.fn()} isStreaming={false} />,
    );

    const textbox = screen.getByRole("textbox");
    await user.type(textbox, "line one{Shift>}{Enter}{/Shift}line two");

    expect(onSubmit).not.toHaveBeenCalled();
    expect(textbox).toHaveValue("line one\nline two");
  });

  it("replaces the Send button with an enabled Stop button while isStreaming is true", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onStop = vi.fn();
    render(<ChatInputForm onSubmit={onSubmit} onStop={onStop} isStreaming />);

    const textbox = screen.getByRole("textbox");
    expect(textbox).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Send" })).not.toBeInTheDocument();

    const stopButton = screen.getByRole("button", { name: "Stop" });
    expect(stopButton).not.toBeDisabled();

    await user.click(stopButton);

    expect(onStop).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
