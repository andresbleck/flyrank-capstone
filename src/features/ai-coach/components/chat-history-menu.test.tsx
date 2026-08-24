import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChatHistoryMenu } from "@/features/ai-coach/components/chat-history-menu";
import type { ArchivedConversation } from "@/features/ai-coach/hooks/use-chat-local-storage";

const andres: ArchivedConversation = {
  id: "1",
  name: "Andres",
  messages: [],
  endedAt: "2026-08-17T12:00:00.000Z",
};

const lucas: ArchivedConversation = {
  id: "2",
  name: "Lucas",
  messages: [],
  endedAt: "2026-08-17T13:00:00.000Z",
};

describe("ChatHistoryMenu", () => {
  it("renders nothing when there are no archived conversations", () => {
    const { container } = render(
      <ChatHistoryMenu conversations={[]} onSelect={vi.fn()} onDelete={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("lists archived conversations by name once opened, and calls onSelect when one is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ChatHistoryMenu
        conversations={[andres, lucas]}
        onSelect={onSelect}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.queryByText("Andres")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "History" }));

    expect(screen.getByText("Andres")).toBeInTheDocument();
    expect(screen.getByText("Lucas")).toBeInTheDocument();

    await user.click(screen.getByText("Lucas"));

    expect(onSelect).toHaveBeenCalledExactlyOnceWith("2");
    expect(screen.queryByText("Andres")).not.toBeInTheDocument();
  });

  it("asks for confirmation and deletes the conversation when confirmed", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const onSelect = vi.fn();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    render(
      <ChatHistoryMenu
        conversations={[andres, lucas]}
        onSelect={onSelect}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole("button", { name: "History" }));
    await user.click(
      screen.getByRole("button", { name: "Borrar conversación de Andres" }),
    );

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledExactlyOnceWith("1");
    expect(onSelect).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it("does not delete the conversation when the confirmation is cancelled", async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(
      <ChatHistoryMenu
        conversations={[andres, lucas]}
        onSelect={vi.fn()}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByRole("button", { name: "History" }));
    await user.click(
      screen.getByRole("button", { name: "Borrar conversación de Andres" }),
    );

    expect(onDelete).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });
});
