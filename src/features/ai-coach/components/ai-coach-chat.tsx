"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  AI_COACH_API_PATH,
  AI_COACH_RESUME_MESSAGE,
} from "@/features/ai-coach/constants";
import {
  ChatInputForm,
  ChatInputFormHandle,
} from "@/features/ai-coach/components/chat-input-form";
import { ChatHistoryMenu } from "@/features/ai-coach/components/chat-history-menu";
import { ChatMessageList } from "@/features/ai-coach/components/chat-message-list";
import { ChatNameGate } from "@/features/ai-coach/components/chat-name-gate";
import {
  ArchivedConversation,
  persistMessages,
  persistName,
  readArchivedConversations,
  readStoredMessages,
  readStoredName,
  startNewConversation,
  switchToConversation,
} from "@/features/ai-coach/hooks/use-chat-local-storage";

export function AiCoachChat() {
  const { messages, status, error, sendMessage, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({ api: AI_COACH_API_PATH }),
  });

  const isStreaming = status === "submitted" || status === "streaming";
  const isWaitingForReply = status === "submitted";
  const lastAssistantMessageRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputFormHandle>(null);
  // True only right after the name gate is submitted or a conversation is
  // picked from history — distinguishes those from the hydration effect
  // also setting `name` for a returning visitor, so autofocus doesn't steal
  // focus from the last-assistant-message effect.
  const justSubmittedNameRef = useRef(false);

  // Tracks "stopped mid-answer, can be resumed" — distinct from isStreaming
  // so the input area can show a Resume button instead of falling back to
  // Send once the stream stops.
  const [isPaused, setIsPaused] = useState(false);

  // null until a name has been given for this conversation — gates the chat
  // behind ChatNameGate until then. Starts null even when a name is already
  // stored, so it's set from the hydration effect below like `messages` is.
  const [name, setName] = useState<string | null>(null);

  const [archivedConversations, setArchivedConversations] = useState<
    ArchivedConversation[]
  >([]);

  const handleSubmit = (content: string) => {
    setIsPaused(false);
    sendMessage({ text: content });
  };

  const handleStop = () => {
    stop();
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    sendMessage({ text: AI_COACH_RESUME_MESSAGE });
  };

  const handleSubmitName = (submittedName: string) => {
    persistName(submittedName);
    justSubmittedNameRef.current = true;
    setName(submittedName);
  };

  const handleNewConversation = () => {
    startNewConversation(name ?? "", messages);
    setMessages([]);
    setName(null);
    setIsPaused(false);
    setArchivedConversations(readArchivedConversations());
  };

  const handleSelectConversation = (id: string) => {
    const restored = switchToConversation(id, name ?? "", messages);
    if (!restored) return;

    setMessages(restored.messages);
    justSubmittedNameRef.current = true;
    setName(restored.name);
    setIsPaused(false);
    setArchivedConversations(readArchivedConversations());
  };

  // Runs client-only, after hydration, to avoid a server/client mismatch
  // (the server render never has access to localStorage). setMessages is
  // exempt from the lint rule below since it's not a useState setter, but
  // setName/setArchivedConversations are the same one-time
  // read-from-localStorage case.
  useEffect(() => {
    setMessages(readStoredMessages());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(readStoredName());
    setArchivedConversations(readArchivedConversations());
  }, [setMessages]);

  // Persist once the assistant's response has fully streamed in, not on
  // every token, to avoid excessive writes during long responses.
  useEffect(() => {
    if (status === "ready" && messages.length > 0) {
      persistMessages(messages);
    }
  }, [status, messages]);

  useEffect(() => {
    if (status === "ready") {
      lastAssistantMessageRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    if (name !== null && justSubmittedNameRef.current) {
      justSubmittedNameRef.current = false;
      chatInputRef.current?.focus();
    }
  }, [name]);

  return (
    <div className="relative flex flex-1 flex-col min-h-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/ia-coach-bg.avif)" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/60" />
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <h1 className="font-[family-name:var(--font-changa-one)] text-xl tracking-tight text-orange-500 uppercase">
            AI Coach
          </h1>
          <p className="text-sm text-gray-300">
            Your personal training and habits assistant
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ChatHistoryMenu
            conversations={archivedConversations}
            onSelect={handleSelectConversation}
          />
          {name && (
            <Button
              type="button"
              onClick={handleNewConversation}
              variant="outline"
              className="shrink-0 bg-orange-500! px-3 py-1.5 font-[family-name:var(--font-baloo-2)] text-xs font-semibold text-white! hover:bg-orange-600!"
            >
              New conversation
            </Button>
          )}
        </div>
      </header>
      {name === null ? (
        <ChatNameGate onSubmitName={handleSubmitName} />
      ) : (
        <>
          <ChatMessageList
            messages={messages}
            lastAssistantMessageRef={lastAssistantMessageRef}
            isWaitingForReply={isWaitingForReply}
          />
          {error && (
            <p role="alert" className="px-4 text-sm text-red-400">
              {error.message}
            </p>
          )}
          <div className="border-t border-white/10 bg-black/40 p-4 backdrop-blur-sm">
            <ChatInputForm
              ref={chatInputRef}
              isStreaming={isStreaming}
              isPaused={isPaused}
              onSubmit={handleSubmit}
              onStop={handleStop}
              onResume={handleResume}
            />
          </div>
        </>
      )}
    </div>
  );
}
