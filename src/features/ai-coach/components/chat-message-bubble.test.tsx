import { render, screen } from "@testing-library/react";
import type { UIMessage } from "ai";
import { describe, expect, it } from "vitest";

import { ChatMessageBubble } from "@/features/ai-coach/components/chat-message-bubble";

const macrosInput = {
  age: 30,
  weightKg: 80,
  heightCm: 180,
  sex: "male" as const,
  activityLevel: "moderate" as const,
  goal: "maintain" as const,
};

const macrosOutput = {
  bmr: 1780,
  tdee: 2759,
  calories: 2259,
  protein: 160,
  carbs: 357,
  fat: 77,
  goal: "lose" as const,
};

function messageWithToolPart(part: Record<string, unknown>): UIMessage {
  return {
    id: "a1",
    role: "assistant",
    parts: [
      { type: "text", text: "" },
      {
        type: "tool-calculateMacros",
        toolCallId: "call-1",
        ...part,
      },
    ],
  } as unknown as UIMessage;
}

describe("ChatMessageBubble tool part rendering", () => {
  it("shows a spinner while the input is still streaming", () => {
    render(
      <ChatMessageBubble
        message={messageWithToolPart({ state: "input-streaming", input: {} })}
      />,
    );

    expect(
      screen.getByText("El coach está armando tu consulta…"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("shows the parsed input once it's available, before the tool has run", () => {
    render(
      <ChatMessageBubble
        message={messageWithToolPart({
          state: "input-available",
          input: macrosInput,
        })}
      />,
    );

    expect(
      screen.getByText(/Voy a calcular para: 30 años/),
    ).toBeInTheDocument();
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
  });

  it("renders the result as a MacroCard component, not raw JSON", () => {
    render(
      <ChatMessageBubble
        message={messageWithToolPart({
          state: "output-available",
          input: macrosInput,
          output: macrosOutput,
        })}
      />,
    );

    expect(screen.getByRole("group")).toBeInTheDocument();
    expect(screen.getByText("2259")).toBeInTheDocument();
    expect(screen.queryByText(/"bmr":/)).not.toBeInTheDocument();
  });

  it("shows a designed error state with the tool's error message", () => {
    render(
      <ChatMessageBubble
        message={messageWithToolPart({
          state: "output-error",
          input: macrosInput,
          errorText:
            "Invalid data: age must be 14-100 and weight/height must be positive.",
        })}
      />,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(
      "No se pudo realizar el cálculo. Revisá tus datos e intentá de nuevo.",
    );
    expect(alert).toHaveTextContent(
      "Invalid data: age must be 14-100 and weight/height must be positive.",
    );
  });

  it("still shows a designed error state when the tool didn't provide errorText", () => {
    render(
      <ChatMessageBubble
        message={messageWithToolPart({
          state: "output-error",
          input: macrosInput,
        })}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "No se pudo realizar el cálculo. Revisá tus datos e intentá de nuevo.",
    );
  });
});
