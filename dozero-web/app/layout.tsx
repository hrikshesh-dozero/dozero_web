import type { Metadata } from "next";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "DoZero",
  description:
    "DoZero lets you architect, hire, and run a full AI-powered company in minutes. Describe your vision. We build the team.",
  keywords: ["AI", "automation", "agents", "company builder", "DoZero", "AI workforce"],
  openGraph: {
    title: "DoZero",
    description:
      "Describe your vision. DoZero drafts the blueprint, hires your AI team, and sets them to work — automatically.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoZero — Build AI Companies From Nothing",
    description: "Describe your vision. DoZero drafts the blueprint, hires your AI team, and sets them to work.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("h-full", "font-sans", geist.variable)}>
      <head>
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
