import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MacroCard } from "@/features/ai-coach/components/macro-card";

const result = {
  bmr: 1600,
  tdee: 2400,
  calories: 2200,
  protein: 150,
  carbs: 200,
  fat: 60,
  goal: "maintain" as const,
};

describe("MacroCard", () => {
  it("renders calories, macros and a goal label describing the group", () => {
    render(<MacroCard {...result} />);

    expect(
      screen.getByRole("group", { name: /Mantener/ }),
    ).toBeInTheDocument();
    expect(screen.getByText("2200")).toBeInTheDocument();
    expect(screen.getByText("150 g")).toBeInTheDocument();
    expect(screen.getByText("200 g")).toBeInTheDocument();
    expect(screen.getByText("60 g")).toBeInTheDocument();
  });

  it.each([
    ["lose", "Bajar de peso"],
    ["gain", "Ganar músculo"],
  ] as const)("labels the '%s' goal as '%s'", (goal, label) => {
    render(<MacroCard {...result} goal={goal} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
