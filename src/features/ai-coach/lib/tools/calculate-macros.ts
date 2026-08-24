import { tool } from "ai";
import { z } from "zod";

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
} as const;

const GOAL_CALORIE_ADJUSTMENTS = {
  lose: -500,
  maintain: 0,
  gain: 300,
} as const;

// Marks a message as safe to show the user as-is (it only describes bad
// input, never internal state), so streamErrorHandler in route.ts can tell
// it apart from provider/network errors, which must stay generic.
export class CalculateMacrosValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CalculateMacrosValidationError";
  }
}

// Type-level validation (e.g. rejecting a string) is handled by Zod at the schema
// boundary. Physical bounds (e.g. age -5) still pass z.number() but are impossible,
// so those are checked separately inside execute.
const calculateMacrosInputSchema = z.object({
  age: z.number().describe("Age in years"),
  weightKg: z.number().describe("Body weight in kilograms"),
  heightCm: z.number().describe("Height in centimeters"),
  sex: z
    .enum(["male", "female"])
    .describe("Biological sex, required by the Mifflin-St Jeor formula constant"),
  activityLevel: z
    .enum(["sedentary", "light", "moderate", "active", "very_active"])
    .describe(
      "Weekly physical activity level, used to scale BMR into total daily energy expenditure",
    ),
  goal: z
    .enum(["lose", "maintain", "gain"])
    .describe("Weight goal, used to adjust total daily calories"),
});

export const calculateMacros = tool({
  description:
    "Estimate daily calorie and macronutrient needs using the Mifflin-St Jeor equation.",
  inputSchema: calculateMacrosInputSchema,
  execute: ({ age, weightKg, heightCm, sex, activityLevel, goal }) => {
    if (age < 14 || age > 100 || weightKg <= 0 || heightCm <= 0) {
      throw new CalculateMacrosValidationError(
        "Invalid data: age must be 14-100 and weight/height must be positive.",
      );
    }

    const bmr =
      sex === "male"
        ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
        : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

    const tdee = bmr * ACTIVITY_MULTIPLIERS[activityLevel];
    const calories = tdee + GOAL_CALORIE_ADJUSTMENTS[goal];

    const protein = 2.0 * weightKg;
    const fat = (calories * 0.25) / 9;
    const carbs = (calories - protein * 4 - fat * 9) / 4;

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      goal,
    };
  },
});

export type CalculateMacrosResult = {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  goal: "lose" | "maintain" | "gain";
};
