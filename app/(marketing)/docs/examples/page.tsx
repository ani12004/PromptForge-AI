"use client"
import React, { useState } from "react"
import { Code, Copy, Check, Terminal, ExternalLink, BookOpen, Cpu, Globe, Braces } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

const EXAMPLES = [
    {
        title: "Node.js (Server-Side)",
        description: "The simplest way to use PromptForge in your backend applications.",
        icon: <Terminal className="w-5 h-5 text-emerald-400" />,
        code: `import dotenv from "dotenv";
import { PromptForgeClient } from "promptforge-server-sdk";

dotenv.config();

const client = new PromptForgeClient({
  apiKey: process.env.PROMPTFORGE_API_KEY
});

async function runPrompt() {
  try {
    const result = await client.execute({
      versionId: "YOUR_VERSION_ID", // Find this in Studio History
      variables: {
        topic: "Artificial Intelligence",
        tone: "friendly"
      }
    });

    if (result.success) {
      console.log("✅ Output:", result.data);
    } else {
      console.error("❌ Error:", result.error);
    }
  } catch (err) {
    console.error("🔥 Fatal:", err.message);
  }
}

runPrompt();`
    },
    {
        title: "Next.js API Route",
        description: "Securely generate prompts in a Next.js App Router API handler.",
        icon: <Globe className="w-5 h-5 text-blue-400" />,
        code: `// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { PromptForgeClient } from "promptforge-server-sdk";

const client = new PromptForgeClient({
  apiKey: process.env.PROMPTFORGE_API_KEY
});

export async function POST(req: Request) {
  const { userInput } = await req.json();

  const result = await client.execute({
    versionId: process.env.PROMPTFORGE_V_ID!,
    variables: { input: userInput }
  });

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ evaluation: result.data });
}`
    },
    {
        title: "Usage Observability",
        description: "Leverage the meta object to track token usage, model info, and latency.",
        icon: <Cpu className="w-5 h-5 text-cyan-400" />,
        code: `const result = await client.execute({
  versionId: "d9e169ff-fe2a-4b9b-9986-833273105e7e",
  variables: { topic: "AI Trends" }
});

if (result.success) {
  // Access detailed usage metrics
  const { usage, model, latency } = result.meta;
  
  console.log(\`Model: \${model}\`);
  console.log(\`Tokens: \${usage.total_tokens}\`);
  console.log(\`Latency: \${latency}ms\`);

  // Perfect for internal billing or analytics
  saveMetricsToLogs(usage, latency);
}`
    },
    {
        title: "Production Error Handling",
        description: "Robust patterns for handling network issues, API timeouts, and failed generations.",
        icon: <Braces className="w-5 h-5 text-purple-400" />,
        code: `async function resilientFetch(input) {
  try {
    const result = await client.execute({
      versionId: "prod-v1",
      variables: { input }
    });

    if (!result.success) {
      // Handle known SDK errors (e.g., Validation, Unauth)
      throw new Error(\`SDK Error: \${result.error}\`);
    }

    return result.data;

  } catch (err) {
    if (err.message.includes("TIMEOUT")) {
      return fallbackResponse(); // Recover gracefully
    }
    console.error("Critical Failure:", err.message);
    throw err;
  }
}`
    }
];

export default function ExamplesPage() {
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

    const copyToClipboard = (text: string, idx: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIdx(idx)
        setTimeout(() => setCopiedIdx(null), 2000)
    }

    return (
        <div className="min-h-screen bg-[#050508] pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-5xl">
                {/* Header */}
                <header className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-wider mb-6"
                    >
                        <Code className="w-3 h-3" />
                        Code Specimens
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">SDK Examples & Use Cases</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Complete, production-ready code samples to help you integrate PromptForge Studio into your workflow in minutes.
                    </p>

                    <div className="mt-10 flex justify-center gap-4">
                        <a
                            href="https://github.com/ani12004/promptforge-server-sdk#readme"
                            target="_blank"
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all"
                        >
                            <BookOpen className="w-4 h-4" />
                            Official SDK Docs
                        </a>
                        <a
                            href="/studio"
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                        >
                            Go to Studio
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </header>

                {/* Examples Grid */}
                <div className="space-y-12">
                    {EXAMPLES.map((example, idx) => (
                        <motion.section
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-purple/10 group-hover:border-brand-purple/20 transition-all">
                                    {example.icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{example.title}</h2>
                                    <p className="text-gray-400 text-sm">{example.description}</p>
                                </div>
                            </div>

                            <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0C] overflow-hidden shadow-2xl">
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={() => copyToClipboard(example.code, idx)}
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-gray-400 hover:text-white transition-all"
                                    >
                                        {copiedIdx === idx ? (
                                            <>
                                                <Check className="w-3 h-3 text-emerald-400" />
                                                <span className="text-emerald-400">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" />
                                                <span>Copy Code</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div className="p-6 md:p-8 overflow-x-auto">
                                    <pre className="text-sm font-mono text-gray-300 leading-relaxed">
                                        <code>{example.code}</code>
                                    </pre>
                                </div>
                                <div className="px-8 py-3 bg-white/5 border-t border-white/10 flex items-center gap-4">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-600 tracking-widest uppercase">
                                        Source code visualization
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="mt-20 p-12 rounded-3xl bg-gradient-to-br from-brand-purple/20 via-transparent to-transparent border border-white/5 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Need more help?</h3>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        Check out our community examples or join our Discord to see how other teams are using PromptForge.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://github.com/ani12004/promptforge-server-sdk" target="_blank" className="text-sm font-bold text-brand-purple hover:underline">View on GitHub</a>
                        <span className="hidden sm:inline text-gray-700">•</span>
                        <a href="/contact" className="text-sm font-bold text-gray-400 hover:text-white transition-all">Contact Support</a>
                    </div>
                </div>
            </div>

            {/* Background Splatters */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-brand-purple/10 blur-[150px] -z-10 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-brand-purple/10 blur-[150px] -z-10 pointer-events-none" />
        </div>
    )
}
