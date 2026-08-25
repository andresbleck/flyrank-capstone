import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import AiCoachError from "@/app/ai-coach/error";

describe("AiCoachError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a generic message and never the raw error message", () => {
    render(
      <AiCoachError error={new Error("boom: stack trace leak")} reset={vi.fn()} />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).not.toHaveTextContent("boom: stack trace leak");
    expect(alert).toHaveTextContent(
      "We couldn't load the AI coach. Please try again.",
    );
  });

  it("calls reset when the Try again button is clicked", async () => {
    const user = userEvent.setup();
    const reset = vi.fn();
    render(<AiCoachError error={new Error("boom")} reset={reset} />);

    await user.click(screen.getByRole("button", { name: "Try again" }));

    expect(reset).toHaveBeenCalledOnce();
  });

  it("logs the error for debugging", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("boom");

    render(<AiCoachError error={error} reset={vi.fn()} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
  });
});
