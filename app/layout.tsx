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
    default: "Prompt Forge Studio | Master the Art of Prompt Engineering",
    template: "%s | Prompt Forge Studio"
  },
  description: "Transform raw user intent into high-quality, optimized AI prompts. The professional studio for prompt engineering, testing, and management.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  keywords: ["prompt engineering", "AI prompts", "prompt optimizer", "LLM tools", "GPT-4 prompts", "Claude prompts", "Gemini prompts", "prompt testing", "A/B testing prompts"],
  authors: [{ name: "PromptForge Team" }],
  creator: "PromptForge Studio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://prompt-forge-studio.vercel.app",
    siteName: "Prompt Forge Studio",
    title: "Prompt Forge Studio | Master the Art of Prompt Engineering",
    description: "Transform raw user intent into high-quality, optimized AI prompts. The professional studio for prompt engineering.",
    images: [
      {
        url: "/icon.png",
        width: 512, // Assuming standard icon size, will verify
        height: 512,
        alt: "Prompt Forge Studio Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PromptForge Studio | Master the Art of Prompt Engineering",
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
import { BadgeProvider } from "@/components/gamification/BadgeProvider";

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
          <BadgeProvider>
            <Shell>{children}</Shell>
          </BadgeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider >
  );
}
