import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(80, "Name must be 80 characters or fewer"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  subject: z.enum(["general", "membership", "ai-coach", "other"]),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message must be 1000 characters or fewer"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const contactSubjectOptions: {
  value: ContactFormInput["subject"];
  label: string;
}[] = [
  { value: "general", label: "General inquiry" },
  { value: "membership", label: "Membership" },
  { value: "ai-coach", label: "AI Coach support" },
  { value: "other", label: "Other" },
];
