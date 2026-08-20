import { act } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Testimonials } from "@/features/home/components/testimonials";

// Espejo de las constantes internas del componente (STEP_INTERVAL_MS,
// SLIDE_TRANSITION_MS, RESET_REENABLE_DELAY_MS), con margen.
const STEP_MS = 2600;
const RESET_MS = 700;

const TOTAL_REVIEWS = 8;
const TRACK_LENGTH = 12; // 8 reseñas + 4 duplicadas para el loop

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

async function advanceOneStep() {
  await advance(STEP_MS);
}

function getTrack(container: HTMLElement) {
  return container.querySelector("#reviews .flex") as HTMLElement;
}

function getCarousel(container: HTMLElement) {
  return container.querySelector("#reviews .max-w-6xl") as HTMLElement;
}

function getTranslateXPercent(track: HTMLElement) {
  const match = /translateX\((-?[\d.]+)%\)/.exec(track.style.transform);
  return match ? Number(match[1]) : NaN;
}

describe("Testimonials", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all eight reviews and starts at the beginning of the track", () => {
    const { container } = render(<Testimonials />);

    for (const name of [
      "Marcus R.",
      "Lucy F.",
      "Diego M.",
      "Valerie S.",
      "Thomas B.",
      "Camille O.",
      "Nicholas P.",
      "Sophia A.",
    ]) {
      expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(1);
    }

    expect(getTranslateXPercent(getTrack(container))).toBeCloseTo(0, 5);
  });

  it("shows English copy in the section header", () => {
    render(<Testimonials />);

    expect(screen.getByText("What Our Members Say")).toBeInTheDocument();
    expect(
      screen.getByText("Real stories from people training at FORGE."),
    ).toBeInTheDocument();
  });

  it("slides the track left by one review after each step", async () => {
    const { container } = render(<Testimonials />);
    const track = getTrack(container);

    await advanceOneStep();

    expect(getTranslateXPercent(track)).toBeCloseTo(-100 / TRACK_LENGTH, 3);
  });

  it("loops back to the start after a full cycle through all reviews", async () => {
    const { container } = render(<Testimonials />);
    const track = getTrack(container);

    for (let step = 0; step < TOTAL_REVIEWS; step += 1) {
      await advanceOneStep();
    }
    // Espera a que se complete el slide final y el salto instantáneo al inicio.
    await advance(RESET_MS);

    expect(getTranslateXPercent(track)).toBeCloseTo(0, 5);
  });

  it("pauses sliding on mouse hover and resumes on mouse leave", async () => {
    const { container } = render(<Testimonials />);
    const carousel = getCarousel(container);
    const track = getTrack(container);

    fireEvent.mouseEnter(carousel);
    await advanceOneStep();
    expect(getTranslateXPercent(track)).toBeCloseTo(0, 5);

    fireEvent.mouseLeave(carousel);
    await advanceOneStep();
    expect(getTranslateXPercent(track)).toBeCloseTo(-100 / TRACK_LENGTH, 3);
  });

  it("does not pause when hovering the section heading, only the carousel", async () => {
    const { container } = render(<Testimonials />);
    const heading = screen.getByText("What Our Members Say");
    const track = getTrack(container);

    fireEvent.mouseEnter(heading);
    await advanceOneStep();

    expect(getTranslateXPercent(track)).toBeCloseTo(-100 / TRACK_LENGTH, 3);
  });

  it("pauses sliding on keyboard focus and resumes on blur", async () => {
    const { container } = render(<Testimonials />);
    const quote = screen.getAllByText(/I walked in barely knowing/)[0];
    const track = getTrack(container);

    fireEvent.focusIn(quote);
    await advanceOneStep();
    expect(getTranslateXPercent(track)).toBeCloseTo(0, 5);

    fireEvent.focusOut(quote, { relatedTarget: document.body });
    await advanceOneStep();
    expect(getTranslateXPercent(track)).toBeCloseTo(-100 / TRACK_LENGTH, 3);
  });

  it("does not auto-slide when prefers-reduced-motion is enabled", async () => {
    mockMatchMedia(true);
    const { container } = render(<Testimonials />);
    const track = getTrack(container);

    await advanceOneStep();
    await advanceOneStep();

    expect(getTranslateXPercent(track)).toBeCloseTo(0, 5);
  });

  it("renders the correct number of filled stars for each rating", () => {
    render(<Testimonials />);

    const marcusCard = screen.getAllByText("Marcus R.")[0].closest("article");
    expect(marcusCard).not.toBeNull();
    expect(
      within(marcusCard as HTMLElement).getByLabelText("5 out of 5 stars"),
    ).toBeInTheDocument();

    const diegoCard = screen.getAllByText("Diego M.")[0].closest("article");
    expect(diegoCard).not.toBeNull();
    expect(
      within(diegoCard as HTMLElement).getByLabelText("4 out of 5 stars"),
    ).toBeInTheDocument();
  });
});
