import type { CalculateMacrosResult } from "@/features/ai-coach/lib/tools/calculate-macros";

const GOAL_LABELS: Record<CalculateMacrosResult["goal"], string> = {
  lose: "Lose weight",
  maintain: "Maintain",
  gain: "Gain muscle",
};

export function MacroCard({
  bmr,
  tdee,
  calories,
  protein,
  carbs,
  fat,
  goal,
}: CalculateMacrosResult) {
  return (
    <div
      role="group"
      aria-label={`Macro calculation result — goal: ${GOAL_LABELS[goal]}`}
      className="w-full max-w-sm rounded-lg border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm"
    >
      <span className="inline-block w-fit rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
        {GOAL_LABELS[goal]}
      </span>

      <div className="mt-3 text-center">
        <p className="text-xs tracking-wide text-gray-300 uppercase">
          Calories
        </p>
        <p className="text-4xl font-bold">
          {calories} <span className="text-base font-normal text-gray-300">kcal</span>
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-md bg-white/5 py-2 text-center">
          <dt className="text-xs tracking-wide text-gray-400 uppercase">
            Protein
          </dt>
          <dd className="text-lg font-semibold">{protein} g</dd>
        </div>
        <div className="rounded-md bg-white/5 py-2 text-center">
          <dt className="text-xs tracking-wide text-gray-400 uppercase">
            Carbs
          </dt>
          <dd className="text-lg font-semibold">{carbs} g</dd>
        </div>
        <div className="rounded-md bg-white/5 py-2 text-center">
          <dt className="text-xs tracking-wide text-gray-400 uppercase">
            Fat
          </dt>
          <dd className="text-lg font-semibold">{fat} g</dd>
        </div>
      </dl>

      <dl className="mt-4 flex justify-center gap-4 border-t border-white/10 pt-2 text-xs text-gray-400">
        <div className="flex gap-1">
          <dt>BMR:</dt>
          <dd>{bmr}</dd>
        </div>
        <div className="flex gap-1">
          <dt>TDEE:</dt>
          <dd>{tdee}</dd>
        </div>
      </dl>
    </div>
  );
}
