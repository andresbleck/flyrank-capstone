"use client";

import { AI_COACH_EXAMPLE_PROMPTS } from "@/features/ai-coach/constants";

type ChatEmptyStateProps = {
  onSelectExample: (text: string) => void;
};

// Splits a trailing "(...)" clarifier off an example label so it can be
// rendered in italics — e.g. "Calculate my macros (Example: ...)" becomes
// "Calculate my macros " + em("(Example: ...)"). Labels without a trailing
// parenthetical render unchanged.
function renderExampleLabel(label: string) {
  const match = label.match(/^(.*)(\([^)]*\))$/);
  if (!match) return label;
  const [, main, parenthetical] = match;
  return (
    <>
      {main}
      <em>{parenthetical}</em>
    </>
  );
}

export function ChatEmptyState({ onSelectExample }: ChatEmptyStateProps) {
  return (
    <div className="m-auto flex max-w-md flex-col items-center gap-4 text-center">
      <div>
        <p className="text-base font-semibold text-white">
          Welcome to your AI Coach!
        </p>
        <p className="mt-1 text-sm text-gray-300">
          Pick an example to get started, or type your own question.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2">
        {AI_COACH_EXAMPLE_PROMPTS.map((example) => (
          <button
            key={example.id}
            type="button"
            onClick={() => onSelectExample(example.label)}
            className="cursor-pointer rounded-lg border border-white/10 bg-white/5 p-3 text-left text-sm text-gray-200 transition-colors hover:border-orange-500/60 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            {renderExampleLabel(example.label)}
          </button>
        ))}
      </div>
    </div>
  );
}
