import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Faq } from "@/features/contact/components/faq";

describe("Faq", () => {
  it("renders the heading, subtitle, and all five questions", () => {
    render(<Faq />);

    expect(
      screen.getByRole("heading", { level: 2, name: "FAQ" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Common questions about training with FORGE."),
    ).toBeInTheDocument();

    for (const question of [
      "Can I cancel my membership anytime?",
      "Do you offer a free trial or day pass?",
      "What's included with AI Coach access?",
      "Are personal trainers included in my plan?",
      "What are your opening hours?",
    ]) {
      expect(screen.getByText(question)).toBeInTheDocument();
    }
  });

  it("opens the first question by default and keeps the rest collapsed", () => {
    render(<Faq />);

    const firstDetails = screen
      .getByText("Can I cancel my membership anytime?")
      .closest("details");
    const secondDetails = screen
      .getByText("Do you offer a free trial or day pass?")
      .closest("details");

    expect(firstDetails).toHaveAttribute("open");
    expect(secondDetails).not.toHaveAttribute("open");
  });

  it("opens a question when its summary is clicked", async () => {
    const user = userEvent.setup();
    render(<Faq />);

    const secondSummary = screen.getByText(
      "Do you offer a free trial or day pass?",
    );
    const secondDetails = secondSummary.closest("details");

    await user.click(secondSummary);

    expect(secondDetails).toHaveAttribute("open");
    expect(
      screen.getByText(/stop by any location for a free tour/),
    ).toBeInTheDocument();
  });
});
