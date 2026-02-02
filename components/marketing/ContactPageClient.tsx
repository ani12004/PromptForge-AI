"use client"

import * as React from "react"
import { useActionState } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { CheckCircle2, MessageSquare, Mail, AlertCircle, Loader2 } from "lucide-react"
import { submitContactForm } from "@/app/actions/contact"

const initialState = {
    success: false,
    error: "",
    validationErrors: {}
}

export function ContactPageClient() {
    const [state, dispatch, isPending] = useActionState(submitContactForm, initialState)
    const [justSubmitted, setJustSubmitted] = React.useState(false)

    React.useEffect(() => {
        if (state.success) {
            setJustSubmitted(true)
            const timer = setTimeout(() => setJustSubmitted(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [state.success])

    return (
        <div className="pb-32 pt-32 px-6">
            <div className="absolute top-0 right-1/2 translate-x-1/2 w-[80vw] h-[500px] bg-brand-violet/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />

            <div className="max-w-2xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 mb-6">
                        <MessageSquare className="h-4 w-4 text-brand-purple" />
                        <span className="text-xs font-bold text-brand-purple uppercase tracking-wider">Contact Us</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">Get in Touch</h1>
                    <p className="text-gray-400 text-lg">
                        Have questions about enterprise plans or custom integrations? <br className="hidden md:block" /> We'd love to hear from you.
                    </p>
                </div>

                <div className="glass-panel p-8 md:p-12 rounded-3xl relative overflow-hidden ring-1 ring-white/10 shadow-2xl shadow-brand-purple/5">
                    {justSubmitted ? (
                        <div className="absolute inset-0 z-10 bg-[#0A0A0A]/90 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                            <div className="bg-green-500/20 p-4 rounded-full mb-6">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">Message Sent!</h3>
                            <p className="text-gray-400">We'll get back to you shortly.</p>
                        </div>
                    ) : null}

                    <form action={dispatch} className="space-y-6">
                        {state.error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {state.error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <Input
                                    name="name"
                                    label="Full Name"
                                    required
                                    className="bg-white/[0.03] border-white/10 focus:border-brand-purple/50 focus:bg-brand-purple/[0.02]"
                                    disabled={isPending}
                                />
                                {state.validationErrors?.name && (
                                    <p className="text-xs text-red-400 ml-1">{state.validationErrors.name[0]}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Input
                                    name="email"
                                    label="Email Address"
                                    type="email"
                                    required
                                    className="bg-white/[0.03] border-white/10 focus:border-brand-purple/50 focus:bg-brand-purple/[0.02]"
                                    disabled={isPending}
                                />
                                {state.validationErrors?.email && (
                                    <p className="text-xs text-red-400 ml-1">{state.validationErrors.email[0]}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Input
                                name="subject"
                                label="Subject"
                                required
                                className="bg-white/[0.03] border-white/10 focus:border-brand-purple/50 focus:bg-brand-purple/[0.02]"
                                disabled={isPending}
                            />
                            {state.validationErrors?.subject && (
                                <p className="text-xs text-red-400 ml-1">{state.validationErrors.subject[0]}</p>
                            )}
                        </div>

                        <div className="space-y-1 relative group">
                            <textarea
                                className="peer block w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white focus:border-brand-purple/50 focus:bg-brand-purple/[0.02] focus:outline-none focus:ring-1 focus:ring-brand-purple/50 min-h-[160px] resize-y placeholder-transparent transition-all duration-200 disabled:opacity-50"
                                placeholder="Message"
                                name="message"
                                id="message"
                                required
                                disabled={isPending}
                            ></textarea>
                            <label
                                htmlFor="message"
                                className="pointer-events-none absolute left-4 top-4 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-sm text-gray-500 font-medium duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-brand-purple"
                            >
                                How can we help?
                            </label>
                            {state.validationErrors?.message && (
                                <p className="text-xs text-red-400 ml-1">{state.validationErrors.message[0]}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full h-14 text-lg font-medium shadow-glow bg-brand-purple hover:bg-brand-purple/90 rounded-xl disabled:opacity-70"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Sending...
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                            <Mail className="h-4 w-4" /> support@promptforge.ai
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
