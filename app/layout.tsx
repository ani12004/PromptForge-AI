import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Shell } from "@/components/layout/Shell";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PromptForge AI | Master the Art of Prompt Engineering",
    template: "%s | PromptForge AI"
  },
  description: "Transform raw user intent into high-quality, optimized AI prompts. The professional studio for prompt engineering, testing, and management.",
  keywords: ["prompt engineering", "AI prompts", "prompt optimizer", "LLM tools", "GPT-4 prompts", "Claude prompts", "Gemini prompts", "prompt testing", "A/B testing prompts"],
  authors: [{ name: "PromptForge Team" }],
  creator: "PromptForge AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prompt-forge-studio.vercel.app",
    siteName: "PromptForge AI",
    title: "PromptForge AI | Master the Art of Prompt Engineering",
    description: "Transform raw user intent into high-quality, optimized AI prompts. The professional studio for prompt engineering.",
    images: [
      {
        url: "/og-image.png", // We should create this or use a placeholder
        width: 1200,
        height: 630,
        alt: "PromptForge AI Studio Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge AI | Master the Art of Prompt Engineering",
    description: "Transform raw user intent into high-quality, optimized AI prompts.",
    creator: "@promptforgeai",
    images: ["/og-image.png"],
  },
  verification: {
    google: "qsBUZ3zd_jjvAZVRc4fxlerl_32C6kvZCIcbUCaTDRk",
  },
  metadataBase: new URL('https://prompt-forge-studio.vercel.app'),
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
        <body
          className={cn(
            inter.variable,
            poppins.variable,
            "antialiased bg-brand-dark min-h-screen text-white font-sans selection:bg-brand-purple/30 selection:text-white overflow-x-hidden"
          )}
        >
          {/* Subtle global gradient background */}
          <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple/10 via-brand-dark to-brand-dark pointer-events-none z-[-1]" />
          <Shell>{children}</Shell>
          <Analytics />
        </body>
      </html>
    </ClerkProvider >
  );
}
