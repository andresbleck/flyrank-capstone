import type { Metadata } from "next";
import { Geist, Geist_Mono, Changa_One, Baloo_2 } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const changaOne = Changa_One({
  weight: "400",
  variable: "--font-changa-one",
  subsets: ["latin"],
});

const baloo2 = Baloo_2({
  weight: "700",
  variable: "--font-baloo-2",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "FORGE",
    template: "%s | FORGE",
  },
  description:
    "FORGE gym — training plans, membership pricing, and an AI coach that builds your routine and macro targets.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${changaOne.variable} ${baloo2.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-neutral-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
        >
          Skip to main content
        </a>
        <nav
          aria-label="Main"
          className="border-b border-white/10 bg-neutral-900 px-4 py-4 sm:px-6"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <Link
              href="/"
              className="font-[family-name:var(--font-changa-one)] text-xl tracking-tight text-orange-500 uppercase transition-colors duration-300 ease-out hover:text-orange-400"
            >
              Forge
            </Link>
            <div className="flex gap-6 font-[family-name:var(--font-baloo-2)] text-sm font-semibold text-gray-300">
              <Link
                href="/"
                className="relative pb-1 transition-colors duration-300 ease-out after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 after:ease-out hover:text-orange-500 hover:after:w-full"
              >
                Home
              </Link>
              <Link
                href="/contact"
                className="relative pb-1 transition-colors duration-300 ease-out after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 after:ease-out hover:text-orange-500 hover:after:w-full"
              >
                Contact
              </Link>
              <Link
                href="/ai-coach"
                className="relative pb-1 transition-colors duration-300 ease-out after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-300 after:ease-out hover:text-orange-500 hover:after:w-full"
              >
                AI Coach
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
