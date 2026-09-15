import type { Metadata } from "next";

import { Contact } from "@/features/contact/components/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with FORGE — visit the gym, send us a message, or reach out on social media.",
};

export default function ContactPage() {
  return <Contact />;
}
