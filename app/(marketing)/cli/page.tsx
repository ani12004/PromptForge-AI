import { Metadata } from "next"
import { Terminal, Package, Command, CheckCircle2, Zap } from "lucide-react"

export const metadata: Metadata = {
    title: "Forge CLI - The Premium Terminal Studio",
    description: "Documentation and complete guide for PromptForge Studio's Forge CLI tool.",
}

function CodeBlock({ code, language = 'bash' }: { code: string, language?: string }) {
    return (
        <div className="relative group w-full my-6">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple/20 to-brand-violet/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0F0F12] border border-white/10 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{language}</span>
                </div>
                <div className="p-4 md:p-6 overflow-x-auto">
                    <pre className="text-sm font-mono text-gray-300 leading-relaxed whitespace-pre">
                        {code}
                    </pre>
                </div>
            </div>
        </div>
    )
}

export default function CLI_Docs_Page() {
    return (
        <div className="pb-32 pt-32 px-6 bg-[#050508] min-h-screen relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-violet/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <Terminal className="h-4 w-4 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">CLI Documentation</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Forge CLI Guide</h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        A professional, premium terminal-native Prompt Engineering studio designed for rapid rapid prompt generation, testing, and AI model evaluation alongside Prompt Forge.
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
                            The Forge CLI is distributed strictly through the npm registry. Install it globally to make the <code className="text-brand-purple bg-brand-purple/10 px-1 py-0.5 rounded">forge</code> command available anywhere on your machine.
                        </p>
                        <CodeBlock code={`npm install -g prompt-forge-studio-cli`} />
                    </section>

                    {/* Authentication */}
                    <section id="authentication" className="space-y-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                            Authentication
                        </h2>
                        <p className="text-lg">
                            The CLI connects seamlessly to your Prompt Forge Studio account utilizing the new generic Execution API endpoint.
                            When you launch the CLI for the first time, it will automatically prompt you to insert your Prompt Forge API Key.
                        </p>
                        <p className="text-lg">
                            If you ever need to overwrite your key, use the <code className="text-brand-purple bg-brand-purple/10 px-1 py-0.5 rounded">:key</code> command inside Studio Mode.
                        </p>
                    </section>

                    {/* Scaffolding */}
                    <section id="initialization" className="space-y-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Zap className="h-8 w-8 text-amber-500" />
                            Initializing a Project
                        </h2>
                        <p className="text-lg">
                            To create a new structured repository for saving prompts, session logs, and configurations:
                        </p>
                        <CodeBlock code={`forge init my-project`} />
                        <p className="text-lg">
                            This scaffolds a generic directory perfectly structured for version controlling your prompts, along with a safely constructed <code className="text-brand-purple bg-brand-purple/10 px-1 py-0.5 rounded">.gitignore</code> file to hide your API caching layer.
                        </p>
                    </section>

                    {/* Interactive REPL Studio */}
                    <section id="studio" className="space-y-6">
                        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Command className="h-8 w-8 text-brand-purple" />
                            Interactive Studio Mode
                        </h2>
                        <p className="text-lg">
                            Running the base command drops you into the highly visual, customized interactive Prompt Forge REPL stream.
                        </p>
                        <CodeBlock code={`forge`} />

                        <div className="mt-8 space-y-4">
                            <h3 className="text-xl font-bold text-white">REPL Commands Reference:</h3>
                            <ul className="space-y-4 list-none p-0">
                                <li className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <span className="font-bold text-brand-purple font-mono">:model</span>
                                    <p className="mt-1 text-sm text-gray-400">Interactively switch you default primary Model provider via the list prompt module.</p>
                                </li>
                                <li className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <span className="font-bold text-brand-purple font-mono">:test all</span>
                                    <p className="mt-1 text-sm text-gray-400">Simulate a ping health-check across all cascading AI providers and render a graphical latency grid.</p>
                                </li>
                                <li className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <span className="font-bold text-brand-purple font-mono">:auto</span>
                                    <p className="mt-1 text-sm text-gray-400">Toggle "Auto-Failover" mode. If active, timeouts to the primary LLM rapidly downgrade to the fallback model.</p>
                                </li>
                                <li className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <span className="font-bold text-brand-purple font-mono">:key</span>
                                    <p className="mt-1 text-sm text-gray-400">Update your core Prompt Forge Studio authentication payload.</p>
                                </li>
                                <li className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <span className="font-bold text-brand-purple font-mono">:clear</span>
                                    <p className="mt-1 text-sm text-gray-400">Cleans the console while restoring the default Prompt Forge session widget component on top.</p>
                                </li>
                                <li className="glass-panel p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                                    <span className="font-bold text-brand-purple font-mono">:exit</span>
                                    <p className="mt-1 text-sm text-gray-400">Safely close out the active context window and exit the application entirely.</p>
                                </li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}
