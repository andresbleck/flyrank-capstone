import { act } from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { MetricsSection } from "@/features/home/components/metrics";

// Espejo de COUNT_UP_DURATION_MS del componente, con margen.
const COUNT_UP_MS = 2100;

class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = [];

  readonly root: Element | Document | null = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  callback: IntersectionObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }

  trigger(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

async function advance(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

function srOnlyTextFor(labelText: string) {
  const label = screen.getByText(labelText);
  const wrapper = label.parentElement as HTMLElement;
  return wrapper.querySelector(".sr-only")?.textContent ?? "";
}

function animatedTextFor(labelText: string) {
  const label = screen.getByText(labelText);
  const wrapper = label.parentElement as HTMLElement;
  return wrapper.querySelector('[aria-hidden="true"]')?.textContent ?? "";
}

describe("MetricsSection", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
    MockIntersectionObserver.instances = [];
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("shows zeroed values before the section enters the viewport", () => {
    render(<MetricsSection />);

    expect(animatedTextFor("Active members")).toBe("+0");
    expect(animatedTextFor("Locations in Tucumán")).toBe("0");
    expect(animatedTextFor("Weekly classes")).toBe("+0");
    expect(animatedTextFor("Member rating")).toBe("0.0/5");

    // El sr-only ya expone el valor final estático, para que un lector de
    // pantalla no tenga que esperar la animación.
    expect(srOnlyTextFor("Active members")).toBe("+5.000 — Active members");
  });

  it("counts up visually to the final formatted values once the section is visible", async () => {
    render(<MetricsSection />);

    const observer = MockIntersectionObserver.instances[0];
    act(() => observer.trigger(true));

    await advance(COUNT_UP_MS);

    expect(animatedTextFor("Active members")).toBe("+5.000");
    expect(animatedTextFor("Locations in Tucumán")).toBe("3");
    expect(animatedTextFor("Weekly classes")).toBe("+50");
    expect(animatedTextFor("Member rating")).toBe("4.9/5");
  });

  it("only observes once and disconnects after becoming visible", () => {
    render(<MetricsSection />);

    const observer = MockIntersectionObserver.instances[0];
    act(() => observer.trigger(true));

    expect(observer.disconnect).toHaveBeenCalledTimes(1);
    expect(MockIntersectionObserver.instances).toHaveLength(1);
  });

  it("shows final values immediately (no animation) when prefers-reduced-motion is enabled", async () => {
    mockMatchMedia(true);
    render(<MetricsSection />);

    const observer = MockIntersectionObserver.instances[0];
    act(() => observer.trigger(true));
    // Un solo frame le alcanza: no hay easing progresivo, salta directo al final.
    await advance(50);

    expect(animatedTextFor("Active members")).toBe("+5.000");
  });

  it("renders with a neutral card-toned background", () => {
    const { container } = render(<MetricsSection />);
    expect(
      container.querySelector("section.bg-neutral-800"),
    ).toBeInTheDocument();
  });
});
