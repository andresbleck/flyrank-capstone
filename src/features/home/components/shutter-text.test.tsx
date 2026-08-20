import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ShutterText } from "@/features/home/components/shutter-text";

function mockMatchMedia(reducedMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reducedMotion,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe("ShutterText", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders each character of the text inside a decorative, hidden container", () => {
    mockMatchMedia(false);
    const { container } = render(<ShutterText text="FORGE" />);

    const root = container.querySelector('[aria-hidden="true"]');
    expect(root).toHaveAttribute("aria-hidden", "true");

    const baseLetters = Array.from(
      container.querySelectorAll('[data-shutter-base="true"]'),
    ).map((node) => node.textContent);
    expect(baseLetters.join("")).toBe("FORGE");
  });

  it("skips the animation classes and slice layers when the user prefers reduced motion", () => {
    mockMatchMedia(true);
    const { container } = render(<ShutterText text="FORGE" />);

    expect(container.querySelectorAll('[class*="animate-"]')).toHaveLength(0);
    expect(container.textContent).toBe("FORGE");
  });

  it("applies staggered animation classes to each letter when motion is allowed", () => {
    mockMatchMedia(false);
    const { container } = render(<ShutterText text="FORGE" />);

    const animatedLayers = container.querySelectorAll('[class*="animate-"]');
    expect(animatedLayers.length).toBeGreaterThan(0);
  });
});
