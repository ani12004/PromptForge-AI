import { Metadata } from "next"
import { Terminal, Package, Command, CheckCircle2, Zap, Activity, Bug, BarChart3, Clock, Shield, HelpCircle, Globe } from "lucide-react"
import CopyButton from "@/components/ui/CopyButton"

export const metadata: Metadata = {
    title: "Forge CLI - The Premium Terminal Studio",
    description: "Documentation and complete guide for PromptForge Studio's Forge CLI tool. Installation, commands, and features.",
}

function CodeBlock({ code, language = 'bash', copyText }: { code: string, language?: string, copyText?: string }) {
    return (
        <div className="relative group w-full my-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple/20 to-brand-violet/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0F0F12] border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{language}</span>
                </div>
                <div className="p-4 md:p-6 overflow-x-auto relative">
                    {copyText && <CopyButton text={copyText} />}
                    <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                        {code}
                    </pre>
                </div>
            </div>
        </div>
    )
}

function TerminalOutput({ output }: { output: string }) {
    return (
        <div className="relative group w-full my-4">
            <div className="relative bg-[#0A0A0D] border border-white/5 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/[0.01]">
                    <Terminal className="h-3 w-3 text-emerald-500/60" />
                    <span className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest">Terminal Output</span>
                </div>
                <div className="p-4 overflow-x-auto">
                    <pre className="text-xs font-mono text-gray-400 leading-relaxed whitespace-pre">
                        {output}
                    </pre>
                </div>
            </div>
        </div>
    )
}

function CommandCard({ cmd, description, output }: { cmd: string, description: string, output: string }) {
    return (
        <li className="glass-panel rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="p-4 pb-2">
                <span className="font-bold text-brand-purple font-mono text-lg">{cmd}</span>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
            </div>
            <div className="px-4 pb-4">
                <TerminalOutput output={output} />
            </div>
        </li>
    )
}

export default function CLI_Docs_Page() {
    return (
        <div className="pb-32 pt-32 px-6 bg-[#050508] min-h-screen relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-violet/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-purple/10 blur-[100px] rounded-full opacity-30 pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <Terminal className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">CLI v1.0.0</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Forge CLI Guide</h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        A professional terminal-native prompt engineering and AI model evaluation studio with intelligent failover,
                        real-time health tracking, and multi-provider benchmarking.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 mb-20 text-gray-300">

                    {/* Installation */}
                    <section id="installation" className="space-y-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Package className="h-8 w-8 text-blue-500" />
                            Installation
                        </h2>
                        <p className="text-lg">
                            Install globally from npm to make the <code className="text-brand-purple bg-brand-purple/10 px-1 py-0.5 rounded">forge</code> command available anywhere on your machine.
                        </p>
                        <CodeBlock
                            code={`npm install -g prompt-forge-ai-cli`}
                            copyText="npm install -g prompt-forge-ai-cli"
                        />
                        <p className="text-sm text-gray-500">Requires Node.js &ge; 18.0.0. All dependencies install automatically.</p>
                    </section>

                    {/* Authentication */}
                    <section id="authentication" className="space-y-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Shield className="h-8 w-8 text-emerald-500" />
                            Authentication
                        </h2>
                        <p className="text-lg">
                            The CLI connects to your Prompt Forge Studio account via API key.
                            On first launch, you&apos;ll be prompted to enter it. Get yours at{" "}
                            <a href="https://prompt-forge-studio.vercel.app" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:underline">
                                prompt-forge-studio.vercel.app
                            </a>.
                        </p>
                        <TerminalOutput output={`No Prompt Forge API key found. Let's get you authenticated.

? Enter your Prompt Forge API Key: ****************************

✔ Prompt Forge API key saved securely locally.`} />
                    </section>

                    {/* Scaffolding */}
                    <section id="initialization" className="space-y-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Zap className="h-8 w-8 text-amber-500" />
                            Initializing a Project
                        </h2>
                        <p className="text-lg">
                            Create a structured repository for saving prompts, sessions, and configs:
                        </p>
                        <CodeBlock code={`forge init my-project`} copyText="forge init my-project" />
                        <TerminalOutput output={`╭──────────────────────────────────────────────────────────╮
│                                                          │
│   Initializing Forge Studio Project: my-project          │
│                                                          │
╰──────────────────────────────────────────────────────────╯

✔ Directories created
✔ Configuration files generated
✔ Git repository initialized

✔ Project setup complete!

Next steps:
  cd my-project
  forge`} />
                    </section>

                    {/* Registry Commands */}
                    <section id="registry" className="space-y-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Globe className="h-8 w-8 text-violet-500" />
                            Hub Registry Commands
                        </h2>
                        <p className="text-lg">
                            The CLI integrates directly with the PromptForge Hub. You can search, pull, and push prompts without leaving your terminal.
                        </p>

                        <div className="space-y-4">
                            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                                <h3 className="text-xl font-bold text-white mb-2 font-mono">forge search {'<query>'}</h3>
                                <p className="text-gray-400 mb-4">Search the global prompt registry for publicly available prompts.</p>
                                <CodeBlock code={`forge search "marketing outline"`} copyText={`forge search "marketing outline"`} />
                            </div>

                            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                                <h3 className="text-xl font-bold text-white mb-2 font-mono">forge pull {'<identifier>'}</h3>
                                <p className="text-gray-400 mb-4">Pull a prompt from the registry by its username/slug combination to use it locally.</p>
                                <CodeBlock code={`forge pull "ani12004/marketing-outline"`} copyText={`forge pull "ani12004/marketing-outline"`} />
                            </div>

                            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                                <h3 className="text-xl font-bold text-white mb-2 font-mono">forge push {'<file>'}</h3>
                                <p className="text-gray-400 mb-4">Publish a local prompt JSON configuration to your PromptForge Hub profile.</p>
                                <CodeBlock code={`forge push prompts/my-awesome-prompt.json`} copyText={`forge push prompts/my-awesome-prompt.json`} />
                            </div>
                        </div>
                    </section>

                    {/* Interactive Studio */}
                    <section id="studio" className="space-y-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Command className="h-8 w-8 text-brand-purple" />
                            Interactive Studio Mode
                        </h2>
                        <p className="text-lg">
                            Launch the studio REPL to start generating AI responses, testing models, and running diagnostics — all from one terminal.
                        </p>
                        <CodeBlock code={`forge`} copyText="forge" />
                        <TerminalOutput output={`  _____  ___   ____    ____  _____   ____  _____  _   _  ____  ___  ___
 |  ___|| _ \\ |  _ \\  / ___|| ____| / ___||_   _|| | | ||  _ \\|_ _|/ _ \\
 | |_  | | | || |_) || |  _ |  _|   \\___ \\  | |  | | | || | | || || | | |
 |  _| | |_| ||  _ < | |_| || |___   ___) | | |  | |_| || |_| || || |_| |
 |_|    \\___/ |_| \\_\\ \\____||_____| |____/  |_|   \\___/ |____/|___|\\___/

Model: nvidia | Status: Online | Latency: - | Auto: ON | Debug: OFF

forge>`} />
                    </section>

                    {/* Commands Reference */}
                    <section id="commands" className="space-y-8">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <HelpCircle className="h-8 w-8 text-cyan-500" />
                            Commands Reference
                        </h2>
                        <p className="text-lg">
                            Type any command below inside Studio Mode. Type <code className="text-brand-purple bg-brand-purple/10 px-1.5 py-0.5 rounded">:help</code> to see them all at any time.
                        </p>

                        <ul className="space-y-6 list-none p-0">

                            <CommandCard
                                cmd=":help"
                                description="Show all available commands and the API key URL."
                                output={`  Available Commands:

  :help       Show this help menu
  :model      Switch primary AI model
  :auto       Toggle auto-failover ON/OFF
  :debug      Toggle debug mode ON/OFF
  :doctor     Run connectivity diagnostics
  :benchmark  Compare all models on same prompt
  :health     Show model health statistics
  :history    Show session prompt history
  :key        Set your Prompt Forge API key
  :clear      Clear the terminal
  :exit       Exit Forge Studio

  Get your API key at:
  https://prompt-forge-studio.vercel.app`} />

                            <CommandCard
                                cmd=":model"
                                description="Interactively switch your default primary AI model provider."
                                output={`? Select a primary model: (Use arrow keys)
❯ nvidia
  gemini

Model: gemini | Status: Online | Latency: - | Auto: ON | Debug: OFF`} />

                            <CommandCard
                                cmd=":doctor"
                                description="Run full connectivity diagnostics across all AI providers. Validates API key format, tests network, and reports latency."
                                output={`╭────────────────────────────╮
│   Running Diagnostics...   │
╰────────────────────────────╯

✔ nvidia is healthy (2376ms)
✔ gemini is healthy (2228ms)

┌──────────┬────────┬──────────────┬───────────────┬──────────────┐
│ Provider │ Status │ Latency      │ Success Count │ Fail Measure │
├──────────┼────────┼──────────────┼───────────────┼──────────────┤
│ nvidia   │ Active │ 2376ms (avg) │ 1             │ 0            │
├──────────┼────────┼──────────────┼───────────────┼──────────────┤
│ gemini   │ Active │ 2228ms (avg) │ 1             │ 0            │
└──────────┴────────┴──────────────┴───────────────┴──────────────┘`} />

                            <CommandCard
                                cmd=":benchmark"
                                description="Run the same prompt on all models side-by-side. Compare latency, token usage, and response preview."
                                output={`╭──────────────────────────────────╮
│   Benchmarking all providers...  │
╰──────────────────────────────────╯

✔ nvidia completed in 2376ms
✔ gemini completed in 1890ms

  Benchmark Report

┌──────────┬────────┬─────────┬─────────────────┬──────────────────────────────┐
│ Provider │ Status │ Latency │ Tokens (In/Out) │ Response Preview             │
├──────────┼────────┼─────────┼─────────────────┼──────────────────────────────┤
│ nvidia   │ ✓ OK   │ 2376ms  │ 33 / 624        │ Node.js is an open-source...│
├──────────┼────────┼─────────┼─────────────────┼──────────────────────────────┤
│ gemini   │ ✓ OK   │ 1890ms  │ 15 / 412        │ Node.js is a JavaScript...  │
└──────────┴────────┴─────────┴─────────────────┴──────────────────────────────┘

  ⚡ Fastest: gemini at 1890ms`} />

                            <CommandCard
                                cmd=":health"
                                description="Display persistent health statistics tracked across sessions in ~/.forge/health.json."
                                output={`┌──────────┬────────┬──────────────┬───────────────┬──────────────┐
│ Provider │ Status │ Latency      │ Success Count │ Fail Measure │
├──────────┼────────┼──────────────┼───────────────┼──────────────┤
│ nvidia   │ Online │ 2376ms (avg) │ 14            │ 2            │
├──────────┼────────┼──────────────┼───────────────┼──────────────┤
│ gemini   │ Online │ 1890ms (avg) │ 8             │ 0            │
└──────────┴────────┴──────────────┴───────────────┴──────────────┘`} />

                            <CommandCard
                                cmd=":debug"
                                description="Toggle debug mode. When ON, shows HTTP status codes, request URLs, latency, tokens, and raw error payloads."
                                output={`╭──────────────────────────╮
│   Debug mode is now ON   │
╰──────────────────────────╯

Model: nvidia | Status: Online | Latency: - | Auto: ON | Debug: ON

forge> hello
- Generating with nvidia...
  [DEBUG] Nvidia → HTTP 200 | 4587ms | Model: nvidia/nemotron-3-nano-30b-a3b
  [DEBUG] Tokens: in=33 out=624`} />

                            <CommandCard
                                cmd=":auto"
                                description="Toggle auto-failover. When active, if the primary model fails after retries, it automatically cascades to the backup model with exponential backoff."
                                output={`╭──────────────────────────────────╮
│   Auto-failover is now ON        │
╰──────────────────────────────────╯

Model: nvidia | Status: Online | Latency: - | Auto: ON | Debug: OFF`} />

                            <CommandCard
                                cmd=":history"
                                description="Show all prompts submitted in the current session along with the model used and response latency."
                                output={`Session History:
1. What is Node.js?
   → [nvidia] 4587ms

2. Explain async/await
   → [gemini] 1890ms

3. Write a REST API example
   → [nvidia] 3241ms`} />

                            <CommandCard
                                cmd=":key"
                                description="Update your Prompt Forge Studio API key. Stored securely in ~/.forge/auth.json."
                                output={`? Enter new Prompt Forge API Key: ****************************

╭───────────────────────────────╮
│   API Key updated safely.     │
╰───────────────────────────────╯`} />

                            <CommandCard
                                cmd=":clear"
                                description="Clear the terminal screen and redraw the status bar."
                                output={`(screen cleared)

Model: nvidia | Status: Online | Latency: 4587ms | Auto: ON | Debug: OFF

forge>`} />

                            <CommandCard
                                cmd=":exit"
                                description="Safely exit Forge Studio."
                                output={`Exiting Forge Studio. Goodbye!`} />

                        </ul>
                    </section>

                    {/* Failover Architecture */}
                    <section id="failover" className="space-y-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Activity className="h-8 w-8 text-rose-500" />
                            Intelligent Failover
                        </h2>
                        <p className="text-lg">
                            The CLI features production-grade failover logic. Each model gets 2 retries with exponential backoff (500ms, 1000ms).
                            If the primary model exhausts all retries, it cascades to the next healthy model automatically.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
                                <h3 className="font-bold text-emerald-400 mb-2">Retries On</h3>
                                <ul className="text-sm text-gray-400 space-y-1">
                                    <li>• HTTP 429 (Rate Limited)</li>
                                    <li>• HTTP 500-599 (Server Error)</li>
                                    <li>• Network Timeout (15s)</li>
                                </ul>
                            </div>
                            <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02]">
                                <h3 className="font-bold text-red-400 mb-2">Fails Immediately On</h3>
                                <ul className="text-sm text-gray-400 space-y-1">
                                    <li>• HTTP 401 (Invalid API Key)</li>
                                    <li>• HTTP 403 (Forbidden)</li>
                                </ul>
                            </div>
                        </div>
                        <TerminalOutput output={`forge> Explain microservices
- Generating with nvidia...
  [WARN] Nvidia failed attempt 1/3 — HTTP 500. Retrying in 500ms...
  [WARN] Nvidia failed attempt 2/3 — HTTP 500. Retrying in 1000ms...
  [WARN] Nvidia failed attempt 3/3 — Exhausted. Falling back...

✔ gemini responded in 1890ms

╭─────────────────────────────────────────────────────╮
│   Warning: Responded using Fallback Model: gemini   │
╰─────────────────────────────────────────────────────╯

╭  AI Response  ──────────────────────────────────────╮
│                                                     │
│   Microservices is an architectural pattern...      │
│                                                     │
│   ---                                               │
│   [Model: gemini | Latency: 1890ms]                 │
│                                                     │
╰─────────────────────────────────────────────────────╯`} />
                    </section>

                </div>
            </div>
        </div>
    )
}
