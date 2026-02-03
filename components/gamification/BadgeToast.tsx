"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/playground/types"
import { Trophy, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BadgeToastProps {
    badge: Badge | null
    isVisible: boolean
    onClose: () => void
}

const RARITY_COLORS = {
    Common: "from-gray-500/20 to-gray-500/5 border-gray-500/50 text-gray-400",
    Skilled: "from-blue-500/20 to-blue-500/5 border-blue-500/50 text-blue-400",
    Advanced: "from-green-500/20 to-green-500/5 border-green-500/50 text-green-400",
    Expert: "from-orange-500/20 to-orange-500/5 border-orange-500/50 text-orange-400",
    Legendary: "from-amber-500/20 to-amber-500/5 border-amber-500/50 text-amber-400",
}

const RARITY_ICONS = {
    Common: "text-gray-400",
    Skilled: "text-blue-400",
    Advanced: "text-green-400",
    Expert: "text-orange-400",
    Legendary: "text-amber-400",
}

export function BadgeToast({ badge, isVisible, onClose }: BadgeToastProps) {
    useEffect(() => {
        if (isVisible) {
            // Auto close after 5 seconds
            const timer = setTimeout(() => {
                onClose()
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [isVisible, onClose])

    if (!badge) return null

    const isImage = badge.icon.includes("/") || badge.icon.includes(".")
    const rarityColorClass = RARITY_COLORS[badge.rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.Common

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.95 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
                >
                    <div className={cn(
                        "relative flex items-center gap-4 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl bg-gradient-to-br overflow-hidden",
                        rarityColorClass,
                        "bg-[#0A0A0A]" // Fallback bg
                    )}>

                        {/* Lighting effect background */}
                        <div className="absolute inset-0 bg-gradient-to-br opacity-10 pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Icon Container */}
                        <div className="relative shrink-0">
                            <div className={cn(
                                "w-16 h-16 rounded-xl flex items-center justify-center bg-[#0F0F0F] border border-white/10 shadow-lg",
                                badge.rarity === 'Legendary' && "shadow-[0_0_15px_rgba(245,158,11,0.2)] border-amber-500/30"
                            )}>
                                {isImage ? (
                                    <img src={badge.icon} alt={badge.name} className="w-12 h-12 object-contain" />
                                ) : (
                                    <Trophy className={cn("h-8 w-8", RARITY_ICONS[badge.rarity as keyof typeof RARITY_ICONS])} />
                                )}
                            </div>
                            {/* Confetti/Sparkles for high rarity could go here */}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-white/10 bg-white/5",
                                    RARITY_ICONS[badge.rarity as keyof typeof RARITY_ICONS]
                                )}>
                                    {badge.rarity}
                                </span>
                                <span className="text-[10px] text-white/40 font-mono">UNLOCKED</span>
                            </div>
                            <h4 className="text-white font-bold text-lg leading-tight mb-1">{badge.name}</h4>
                            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{badge.description}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
