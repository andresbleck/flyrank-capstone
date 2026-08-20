"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChatNameInput,
  chatNameSchema,
} from "@/features/ai-coach/lib/chat-name-schema";

type ChatNameGateProps = {
  onSubmitName: (name: string) => void;
};

export function ChatNameGate({ onSubmitName }: ChatNameGateProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChatNameInput>({
    resolver: zodResolver(chatNameSchema),
    defaultValues: { name: "" },
  });

  const submit = handleSubmit(({ name }) => {
    onSubmitName(name);
  });

  const errorId = "chat-name-error";

  return (
    <form
      onSubmit={submit}
      className="m-auto flex w-full max-w-sm flex-col gap-3 p-4 text-center"
    >
      <label htmlFor="chat-name-input" className="text-sm text-gray-300">
        What&apos;s your name? We&apos;ll save this conversation under it.
      </label>
      <Input
        id="chat-name-input"
        {...register("name")}
        autoFocus
        placeholder="Your name"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? errorId : undefined}
        className="bg-white/10 text-center text-white placeholder:text-gray-400 focus:border-orange-500!"
      />
      {errors.name && (
        <p id={errorId} role="alert" className="text-sm text-red-400">
          {errors.name.message}
        </p>
      )}
      <Button
        type="submit"
        variant="accent"
        className="font-[family-name:var(--font-baloo-2)] font-semibold"
      >
        Start chatting
      </Button>
    </form>
  );
}
