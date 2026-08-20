import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PricingPlans } from "@/features/home/components/pricing-plans";

describe("PricingPlans", () => {
  it("renders all three plan names and prices", () => {
    render(<PricingPlans />);

    expect(
      screen.getByRole("heading", { name: "Monthly" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Annual" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pro" })).toBeInTheDocument();

    expect(screen.getByText("$49")).toBeInTheDocument();
    expect(screen.getByText("$39")).toBeInTheDocument();
    expect(screen.getByText("$89")).toBeInTheDocument();
  });

  it("marks the Annual plan as the most popular", () => {
    render(<PricingPlans />);

    expect(screen.getByText("Most popular · Save 20%")).toBeInTheDocument();
  });

  it("renders each plan's call to action", () => {
    render(<PricingPlans />);

    expect(
      screen.getByRole("button", { name: "Choose Monthly" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Choose Annual" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Go Pro" }),
    ).toBeInTheDocument();
  });
});
