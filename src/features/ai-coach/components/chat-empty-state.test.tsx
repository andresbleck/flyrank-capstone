import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChatEmptyState } from "@/features/ai-coach/components/chat-empty-state";
import { AI_COACH_EXAMPLE_PROMPTS } from "@/features/ai-coach/constants";

describe("ChatEmptyState", () => {
  it("renders the three examples in order, with calculateMacros first", () => {
    render(<ChatEmptyState onSelectExample={vi.fn()} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(buttons.map((button) => button.textContent)).toEqual(
      AI_COACH_EXAMPLE_PROMPTS.map((example) => example.label),
    );
  });

  it("calls onSelectExample with the example's label when clicked", async () => {
    const user = userEvent.setup();
    const onSelectExample = vi.fn();
    render(<ChatEmptyState onSelectExample={onSelectExample} />);

    await user.click(
      screen.getByRole("button", { name: AI_COACH_EXAMPLE_PROMPTS[1].label }),
    );

    expect(onSelectExample).toHaveBeenCalledExactlyOnceWith(
      AI_COACH_EXAMPLE_PROMPTS[1].label,
    );
  });
});
