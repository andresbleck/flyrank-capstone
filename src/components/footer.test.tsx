import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Footer } from "@/components/footer";

describe("Footer", () => {
  it("renders the primary navigation links", () => {
    render(<Footer />);

    expect(
      screen.getByRole("navigation", { name: "Footer" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
    expect(screen.getByRole("link", { name: "AI Coach" })).toHaveAttribute(
      "href",
      "/ai-coach",
    );
  });

  it("links every membership plan to the pricing section", () => {
    render(<Footer />);

    for (const label of ["Monthly", "Annual", "Pro"]) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        "/#plans",
      );
    }
  });

  it("renders the copyright with the current year", () => {
    render(<Footer />);

    const year = new Date().getFullYear();
    expect(
      screen.getByText(`© ${year} FORGE. All rights reserved.`),
    ).toBeInTheDocument();
  });

  it("gives every social link an accessible name", () => {
    render(<Footer />);

    expect(
      screen.getByRole("link", { name: "Follow FORGE on Instagram" }),
    ).toHaveAttribute("href", "#");
    expect(
      screen.getByRole("link", { name: "Follow FORGE on Facebook" }),
    ).toHaveAttribute("href", "#");
    expect(
      screen.getByRole("link", { name: "Follow FORGE on TikTok" }),
    ).toHaveAttribute("href", "#");
  });
});
