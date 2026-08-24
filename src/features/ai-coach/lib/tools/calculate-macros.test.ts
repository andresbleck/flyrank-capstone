import { describe, expect, it } from "vitest";

import {
  CalculateMacrosValidationError,
  calculateMacros,
  type CalculateMacrosResult,
} from "@/features/ai-coach/lib/tools/calculate-macros";

type Input = Parameters<NonNullable<typeof calculateMacros.execute>>[0];
type Options = Parameters<NonNullable<typeof calculateMacros.execute>>[1];

const options = { toolCallId: "test-call", messages: [] } as unknown as Options;

function runCalculateMacros(input: Input) {
  return calculateMacros.execute!(input, options) as CalculateMacrosResult;
}

const validInput: Input = {
  age: 30,
  weightKg: 80,
  heightCm: 180,
  sex: "male",
  activityLevel: "moderate",
  goal: "maintain",
};

describe("calculateMacros", () => {
  it("calculates BMR, TDEE, calories and protein for a male maintaining weight", () => {
    const result = runCalculateMacros(validInput);

    expect(result.bmr).toBe(1780);
    expect(result.tdee).toBe(2759);
    expect(result.calories).toBe(2759);
    expect(result.protein).toBe(160);
    expect(result.goal).toBe("maintain");
  });

  it("uses the female BMR formula (subtracts 161 instead of adding 5)", () => {
    const result = runCalculateMacros({
      ...validInput,
      sex: "female",
      activityLevel: "sedentary",
    });

    expect(result.bmr).toBe(1614);
  });

  it("subtracts 500 calories from TDEE for a 'lose' goal", () => {
    const maintain = runCalculateMacros(validInput);
    const lose = runCalculateMacros({ ...validInput, goal: "lose" });

    expect(lose.calories).toBe(maintain.tdee - 500);
  });

  it("adds 300 calories to TDEE for a 'gain' goal", () => {
    const maintain = runCalculateMacros(validInput);
    const gain = runCalculateMacros({ ...validInput, goal: "gain" });

    expect(gain.calories).toBe(maintain.tdee + 300);
  });

  it("accepts the boundary ages 14 and 100", () => {
    expect(() => runCalculateMacros({ ...validInput, age: 14 })).not.toThrow();
    expect(() => runCalculateMacros({ ...validInput, age: 100 })).not.toThrow();
  });

  it.each([
    ["age below 14", { age: 13 }],
    ["age above 100", { age: 101 }],
    ["zero weight", { weightKg: 0 }],
    ["negative weight", { weightKg: -5 }],
    ["zero height", { heightCm: 0 }],
    ["negative height", { heightCm: -5 }],
  ])("rejects %s with CalculateMacrosValidationError", (_label, overrides) => {
    expect(() =>
      runCalculateMacros({ ...validInput, ...overrides }),
    ).toThrow(CalculateMacrosValidationError);
  });
});
