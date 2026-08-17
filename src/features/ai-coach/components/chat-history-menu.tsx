"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ArchivedConversation } from "@/features/ai-coach/hooks/use-chat-local-storage";

type ChatHistoryMenuProps = {
  conversations: ArchivedConversation[];
  onSelect: (id: string) => void;
};

export function ChatHistoryMenu({ conversations, onSelect }: ChatHistoryMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (conversations.length === 0) return null;

  return (
    <div className="relative shrink-0">
      <Button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="bg-white/10 px-3 py-1.5 text-xs hover:bg-white/20"
      >
        History
      </Button>
      {isOpen && (
        <ul className="absolute right-0 z-10 mt-2 max-h-64 w-56 overflow-y-auto rounded-md border border-white/10 bg-gray-900 py-1 shadow-lg">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onSelect(conversation.id);
                }}
                className="flex w-full cursor-pointer flex-col items-start px-3 py-2 text-left text-sm text-white hover:bg-white/10"
              >
                <span className="font-medium">{conversation.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(conversation.endedAt).toLocaleString()}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
