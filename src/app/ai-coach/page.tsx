import type { Metadata } from "next";

import { AiCoachChat } from "@/features/ai-coach/components/ai-coach-chat";

export const metadata: Metadata = {
  title: "AI Coach",
  description:
    "Chat with the FORGE AI coach for personalized training, nutrition, and habit plans.",
};

export default function AiCoach() {
  return (
    <main id="main-content" className="flex flex-1 flex-col min-h-0">
      <AiCoachChat />
    </main>
  );
}
