"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { KeyboardEvent } from "react";
import { forwardRef, useImperativeHandle } from "react";
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

export type ChatInputFormHandle = {
  focus: () => void;
};

export const ChatInputForm = forwardRef<ChatInputFormHandle, ChatInputFormProps>(
  function ChatInputForm(
    { onSubmit, onStop, onResume, isStreaming, isPaused },
    ref,
  ) {
    const {
      register,
      handleSubmit,
      reset,
      setFocus,
      formState: { errors },
    } = useForm<ChatMessageInput>({
      resolver: zodResolver(chatMessageSchema),
      defaultValues: { content: "" },
    });

    useImperativeHandle(ref, () => ({
      focus: () => setFocus("content"),
    }));

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
            placeholder={errors.content ? "" : "Ask your AI coach anything..."}
            aria-invalid={!!errors.content}
            aria-describedby={errors.content ? errorId : undefined}
            disabled={isStreaming}
            className={
              errors.content
                ? "bg-white/10 pr-20 text-white placeholder:text-gray-400 border-red-400!"
                : "bg-white/10 pr-20 text-white placeholder:text-gray-400 focus:border-orange-500!"
            }
          />
          {errors.content && (
            <p
              id={errorId}
              role="alert"
              className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-red-400"
            >
              {errors.content.message}
            </p>
          )}
          {isStreaming ? (
            <Button
              type="button"
              onClick={onStop}
              variant="outline"
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
              variant="accent"
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              Send
            </Button>
          )}
        </div>
      </form>
    );
  },
);
