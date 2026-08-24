"use client";

import { SVGProps, useState } from "react";

import { Button } from "@/components/ui/button";
import type { ArchivedConversation } from "@/features/ai-coach/hooks/use-chat-local-storage";

type ChatHistoryMenuProps = {
  conversations: ArchivedConversation[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 7h12M9.5 7V5.5a1.5 1.5 0 0 1 1.5-1.5h2a1.5 1.5 0 0 1 1.5 1.5V7m-8 0 .7 12.1a2 2 0 0 0 2 1.9h4.6a2 2 0 0 0 2-1.9L17.5 7"
      />
    </svg>
  );
}

export function ChatHistoryMenu({
  conversations,
  onSelect,
  onDelete,
}: ChatHistoryMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (conversations.length === 0) return null;

  return (
    <div className="relative shrink-0">
      <Button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        variant="outline"
        className="bg-orange-500! px-3 py-1.5 font-[family-name:var(--font-baloo-2)] text-xs font-semibold text-white! hover:bg-orange-600!"
      >
        History
      </Button>
      {isOpen && (
        <ul className="absolute right-0 z-10 mt-2 max-h-64 w-56 overflow-y-auto rounded-md border border-white/10 bg-neutral-900 py-1 shadow-lg">
          {conversations.map((conversation) => (
            <li key={conversation.id} className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onSelect(conversation.id);
                }}
                className="flex min-w-0 flex-1 cursor-pointer flex-col items-start px-3 py-2 text-left text-sm text-white hover:bg-white/10"
              >
                <span className="font-medium">{conversation.name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(conversation.endedAt).toLocaleString()}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      `¿Borrar la conversación de ${conversation.name}? Esta acción no se puede deshacer.`,
                    )
                  ) {
                    onDelete(conversation.id);
                  }
                }}
                aria-label={`Borrar conversación de ${conversation.name}`}
                className="mr-1 shrink-0 cursor-pointer rounded p-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
