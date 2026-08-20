import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Hero } from "@/features/home/components/hero";

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reducedMotion,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("Hero", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the FORGE title and the plans CTA", () => {
    mockMatchMedia(false);
    render(<Hero />);

    expect(
      screen.getByRole("heading", { name: "FORGE" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start training" })).toHaveAttribute(
      "href",
      "#plans",
    );
  });
});
