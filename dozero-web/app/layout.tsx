import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DoZero — Build AI Companies From Nothing",
  description:
    "DoZero lets you architect, hire, and run a full AI-powered company in minutes. Describe your vision. We build the team.",
  keywords: ["AI", "automation", "agents", "company builder", "DoZero", "AI workforce"],
  openGraph: {
    title: "DoZero — Build AI Companies From Nothing",
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
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@300;400;500;600&family=Inter:wght@300;400;500;600;700&family=Architects+Daughter&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
