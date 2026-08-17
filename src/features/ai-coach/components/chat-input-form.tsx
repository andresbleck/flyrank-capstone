"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ChatMessageInput,
  chatMessageSchema,
} from "@/features/ai-coach/lib/chat-message-schema";

type ChatInputFormProps = {
  onSubmit: (content: string) => void;
  onStop: () => void;
  onResume: () => void;
  isStreaming: boolean;
  isPaused: boolean;
};

export function ChatInputForm({
  onSubmit,
  onStop,
  onResume,
  isStreaming,
  isPaused,
}: ChatInputFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatMessageInput>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: { content: "" },
  });

  const submit = handleSubmit(({ content }) => {
    onSubmit(content);
    reset();
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const errorId = "chat-input-error";

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <div className="relative">
        <Textarea
          {...register("content")}
          onKeyDown={handleKeyDown}
          rows={3}
          placeholder="Ask your AI coach anything..."
          aria-invalid={!!errors.content}
          aria-describedby={errors.content ? errorId : undefined}
          disabled={isStreaming}
          className="bg-white/10 pr-20 text-white placeholder:text-gray-400"
        />
        {isStreaming ? (
          <Button
            type="button"
            onClick={onStop}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            Stop
          </Button>
        ) : isPaused ? (
          <Button
            type="button"
            onClick={onResume}
            variant="danger"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            Resume
          </Button>
        ) : (
          <Button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            Send
          </Button>
        )}
      </div>
      {errors.content && (
        <p id={errorId} role="alert" className="text-sm text-red-400">
          {errors.content.message}
        </p>
      )}
    </form>
  );
}
