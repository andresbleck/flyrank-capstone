import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChatNameGate } from "@/features/ai-coach/components/chat-name-gate";
import { AI_COACH_MAX_NAME_LENGTH } from "@/features/ai-coach/constants";

describe("ChatNameGate", () => {
  it("calls onSubmitName with the trimmed name", async () => {
    const user = userEvent.setup();
    const onSubmitName = vi.fn();
    render(<ChatNameGate onSubmitName={onSubmitName} />);

    await user.type(screen.getByLabelText(/what's your name/i), "  Andres  ");
    await user.click(screen.getByRole("button", { name: "Start chatting" }));

    expect(onSubmitName).toHaveBeenCalledExactlyOnceWith("Andres");
  });

  it("shows a validation error and does not submit when the name is empty", async () => {
    const user = userEvent.setup();
    const onSubmitName = vi.fn();
    render(<ChatNameGate onSubmitName={onSubmitName} />);

    await user.click(screen.getByRole("button", { name: "Start chatting" }));

    expect(onSubmitName).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Name cannot be empty");
    expect(screen.getByLabelText(/what's your name/i)).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("shows a validation error and does not submit when the name is only whitespace", async () => {
    const user = userEvent.setup();
    const onSubmitName = vi.fn();
    render(<ChatNameGate onSubmitName={onSubmitName} />);

    await user.type(screen.getByLabelText(/what's your name/i), "   ");
    await user.click(screen.getByRole("button", { name: "Start chatting" }));

    expect(onSubmitName).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows a validation error and does not submit when the name is too long", async () => {
    const user = userEvent.setup();
    const onSubmitName = vi.fn();
    render(<ChatNameGate onSubmitName={onSubmitName} />);

    const tooLong = "a".repeat(AI_COACH_MAX_NAME_LENGTH + 1);
    await user.type(screen.getByLabelText(/what's your name/i), tooLong);
    await user.click(screen.getByRole("button", { name: "Start chatting" }));

    expect(onSubmitName).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
