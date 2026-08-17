"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

import {
  AI_COACH_API_PATH,
  AI_COACH_RESUME_MESSAGE,
} from "@/features/ai-coach/constants";
import { ChatInputForm } from "@/features/ai-coach/components/chat-input-form";
import { ChatMessageList } from "@/features/ai-coach/components/chat-message-list";
import {
  persistMessages,
  readStoredMessages,
} from "@/features/ai-coach/hooks/use-chat-local-storage";

export function AiCoachChat() {
  const { messages, status, error, sendMessage, setMessages, stop } = useChat({
    transport: new DefaultChatTransport({ api: AI_COACH_API_PATH }),
  });

  const isStreaming = status === "submitted" || status === "streaming";
  const isWaitingForReply = status === "submitted";
  const lastAssistantMessageRef = useRef<HTMLDivElement>(null);

  // Tracks "stopped mid-answer, can be resumed" — distinct from isStreaming
  // so the input area can show a Resume button instead of falling back to
  // Send once the stream stops.
  const [isPaused, setIsPaused] = useState(false);

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

  // Runs client-only, after hydration, to avoid a server/client mismatch
  // (the server render never has access to localStorage).
  useEffect(() => {
    setMessages(readStoredMessages());
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

  return (
    <div className="relative flex flex-1 flex-col min-h-0">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/ia-coach-bg.avif)" }}
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/60" />
      <header className="border-b border-white/10 px-4 py-3">
        <h1 className="text-lg font-semibold text-white">AI Coach</h1>
        <p className="text-sm text-gray-300">
          Your personal training and habits assistant
        </p>
      </header>
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
          isStreaming={isStreaming}
          isPaused={isPaused}
          onSubmit={handleSubmit}
          onStop={handleStop}
          onResume={handleResume}
        />
      </div>
    </div>
  );
}
