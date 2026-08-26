"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contactFormSchema,
  contactSubjectOptions,
  type ContactFormInput,
} from "@/features/contact/lib/contact-form-schema";

const fieldClasses =
  "mt-1 bg-white/10 text-white placeholder:text-gray-400 focus:border-orange-500!";

const labelClasses =
  "text-xs font-semibold tracking-widest text-gray-400 uppercase";

export function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const successRef = useRef<HTMLParagraphElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "general", message: "" },
  });

  useEffect(() => {
    if (isSubmitted) {
      successRef.current?.focus();
    }
  }, [isSubmitted]);

  const submit = handleSubmit((data) => {
    // TODO: wire this up to a real submission endpoint.
    console.log("Contact form submitted", data);
    reset();
    setIsSubmitted(true);
  });

  if (isSubmitted) {
    return (
      <p
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-orange-500/40 bg-orange-500/10 p-6 text-center text-sm text-white focus:outline-none"
      >
        Thanks for reaching out! We&apos;ll get back to you soon.
      </p>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-busy={isSubmitting}
      className="flex flex-col gap-4"
    >
      <div>
        <label htmlFor="contact-name" className={labelClasses}>
          Name
        </label>
        <Input
          id="contact-name"
          {...register("name")}
          placeholder="Your name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
          className={fieldClasses}
        />
        {errors.name && (
          <p id="contact-name-error" role="alert" className="mt-1 text-xs text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClasses}>
          Email
        </label>
        <Input
          id="contact-email"
          type="email"
          {...register("email")}
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
          className={fieldClasses}
        />
        {errors.email && (
          <p id="contact-email-error" role="alert" className="mt-1 text-xs text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClasses}>
          Subject
        </label>
        <select
          id="contact-subject"
          {...register("subject")}
          className="mt-1 w-full rounded-md border border-gray-300 bg-white/10 px-3 py-2 text-sm text-white focus:border-orange-500 focus:outline-none [&>option]:bg-neutral-900"
        >
          {contactSubjectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClasses}>
          Message
        </label>
        <Textarea
          id="contact-message"
          rows={4}
          {...register("message")}
          placeholder="How can we help?"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          className={fieldClasses}
        />
        {errors.message && (
          <p id="contact-message-error" role="alert" className="mt-1 text-xs text-red-400">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="accent"
        disabled={isSubmitting}
        className="mt-2 font-[family-name:var(--font-baloo-2)] font-semibold"
      >
        Send message
      </Button>
    </form>
  );
}
