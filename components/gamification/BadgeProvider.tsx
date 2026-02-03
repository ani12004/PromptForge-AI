"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import { Badge } from "@/components/playground/types"
import { BadgeToast } from "./BadgeToast"
import confetti from "canvas-confetti"

interface BadgeContextType {
    showBadge: (badge: Badge) => void
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined)

export function useBadgeNotification() {
    const context = useContext(BadgeContext)
    if (!context) {
        throw new Error("useBadgeNotification must be used within a BadgeProvider")
    }
    return context
}

export function BadgeProvider({ children }: { children: React.ReactNode }) {
    const [currentBadge, setCurrentBadge] = useState<Badge | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    const showBadge = useCallback((badge: Badge) => {
        setCurrentBadge(badge)
        setIsVisible(true)

        // Trigger sound effect or confetti if needed
        if (badge.rarity === "Legendary" || badge.rarity === "Expert") {
            triggerConfetti()
        }
    }, [])

    const closeBadge = useCallback(() => {
        setIsVisible(false)
        // Wait for animation to finish before clearing data
        setTimeout(() => setCurrentBadge(null), 500)
    }, [])

    const triggerConfetti = () => {
        const duration = 3 * 1000
        const end = Date.now() + duration

        const colors = ['#8b5cf6', '#d8b4fe', '#f59e0b']

            ; (function frame() {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                })
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                })

                if (Date.now() < end) {
                    requestAnimationFrame(frame)
                }
            })()
    }

    return (
        <BadgeContext.Provider value={{ showBadge }}>
            {children}
            <BadgeToast
                badge={currentBadge}
                isVisible={isVisible}
                onClose={closeBadge}
            />
        </BadgeContext.Provider>
    )
}
