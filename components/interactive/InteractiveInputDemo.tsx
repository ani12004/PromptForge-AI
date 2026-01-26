"use client"
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser } from "@clerk/nextjs"
import { analyzePromptIntent } from "@/app/actions/analyze"

const GHOST_TEXTS = [
    "Write a python script to parse CSV...",
    "Generate a cyberpunk city description...",
    "Explain quantum entanglement to a 5-year-old...",
    "Design a marketing email for a SaaS product..."
]

export function InteractiveInputDemo() {
    const { isSignedIn } = useUser()
    const [displayedText, setDisplayedText] = React.useState("")
    const [ghostIndex, setGhostIndex] = React.useState(0)
    const [charIndex, setCharIndex] = React.useState(0)
    const [isDeleting, setIsDeleting] = React.useState(false)

    // Typewriter effect
    React.useEffect(() => {
        const currentFullText = GHOST_TEXTS[ghostIndex]
        let timeout: NodeJS.Timeout

        const type = () => {
            if (isDeleting) {
                setDisplayedText(currentFullText.substring(0, charIndex - 1))
                setCharIndex(prev => prev - 1)

                if (charIndex <= 0) {
                    setIsDeleting(false)
                    setGhostIndex((prev) => (prev + 1) % GHOST_TEXTS.length)
                    timeout = setTimeout(type, 500)
                } else {
                    timeout = setTimeout(type, 50)
                }
            } else {
                setDisplayedText(currentFullText.substring(0, charIndex + 1))
                setCharIndex(prev => prev + 1)

                if (charIndex >= currentFullText.length) {
                    setIsDeleting(true)
                    timeout = setTimeout(type, 2000)
                } else {
                    timeout = setTimeout(type, 80)
                }
            }
        }

        timeout = setTimeout(type, 100)
        return () => clearTimeout(timeout)
    }, [charIndex, isDeleting, ghostIndex])

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 mb-12 relative z-20">
            <div className="relative group cursor-default"> {/* Cursor default to indicate no interaction */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-violet rounded-2xl opacity-20 blur transition duration-500" />
                <div className="relative bg-[#0A0A0A] border border-white/10 rounded-xl p-3 flex items-center shadow-2xl">

                    {/* Static Icon */}
                    <div className="pl-4 pr-3 flex items-center justify-center min-w-[40px]">
                        <Sparkles className="h-5 w-5 text-gray-500" />
                    </div>

                    <div className="flex-1 relative h-12 flex items-center overflow-hidden">
                        {/* Read-only display */}
                        <div className="w-full h-full flex items-center text-white text-lg font-medium px-1">
                            <span>{displayedText}</span>
                            <span className="w-[2px] h-6 bg-brand-purple/50 animate-pulse ml-0.5" />
                        </div>
                    </div>

                    {/* Visual Button - No Action or Link to Studio */}
                    <div className="bg-white text-black p-2 rounded-lg ml-2 opacity-80">
                        <ArrowRight className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </div>
    )
}
