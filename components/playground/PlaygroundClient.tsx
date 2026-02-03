"use client"

import React, { useState } from "react"
import { CHALLENGES } from "./data/challenges"
import { GameMode, Challenge } from "./types"
import { PlaygroundLanding } from "./PlaygroundLanding"
import { GameShell } from "./GameShell"
import { ModeFixer } from "./modes/ModeFixer"
import { ModeBuilder } from "./modes/ModeBuilder"
import { ModeBattle } from "./modes/ModeBattle"
import { ModePrecision } from "./modes/ModePrecision"
import { HowToPlay } from "./HowToPlay"
import { awardBadge } from "@/app/actions/gamification"
import { Toast, ToastType } from "@/components/ui/Toast"
import { useBadgeNotification } from "@/components/gamification/BadgeProvider"


export function PlaygroundClient() {
    // Game State
    const [mode, setMode] = useState<GameMode | null>(null)
    const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null)
    const [xp, setXp] = useState(0)
    const [showHowToPlay, setShowHowToPlay] = useState(false)
    const [toast, setToast] = useState<{ msg: string; type: ToastType; visible: boolean }>({
        msg: "", type: "success", visible: false
    })

    const userLevel = Math.floor(xp / 1000) + 1

    // Get challenges for active mode
    const modeChallenges = mode ? CHALLENGES.filter(c => c.mode === mode) : []
    const activeChallenge = activeChallengeId ? CHALLENGES.find(c => c.id === activeChallengeId) : null

    // Handlers
    const handleSelectMode = (m: GameMode) => {
        setMode(m)
        // Auto-select first challenge or next incomplete one
        const first = CHALLENGES.find(c => c.mode === m)
        if (first) setActiveChallengeId(first.id)
    }

    const showToast = (msg: string, type: ToastType = "success") => {
        setToast({ msg, type, visible: true })
    }

    const checkBadges = async (action: string) => {
        // Simple client-side mapping for MVP
        let condition = ""
        if (action === "first_win") condition = "first_challenge"
        if (action === "fixer_win") condition = "fixer_3" // Simplified
        if (action === "precision_win") condition = "precision_5_perfect" // Simplified logic

        // Always check "Prompt Rookie" for any first win
        await tryAwardBadge("first_challenge")

        if (mode === "fixer") await tryAwardBadge("fixer_3")
        if (mode === "precision") await tryAwardBadge("precision_5_perfect")
    }

    const { showBadge } = useBadgeNotification()

    const tryAwardBadge = async (condition: string) => {
        try {
            const badge = await awardBadge(condition)
            if (badge) {
                showBadge(badge)
                // Toast is redundant now for badges, relying on the new popup
            }
        } catch (e) {
            console.error("Badge check failed", e)
        }
    }

    const handleComplete = async (reward: number) => {
        setXp(prev => prev + reward)
        showToast(`Challenge Complete! +${reward} XP`, "success")

        // Check for badges
        await checkBadges("first_win")

        // Auto-advance after short delay or immediately
        // Find current index
        const currentIndex = CHALLENGES.findIndex(c => c.id === activeChallengeId)
        const nextChallenge = CHALLENGES[currentIndex + 1]

        if (nextChallenge && nextChallenge.mode === mode) {
            // Move to next challenge in same mode
            setTimeout(() => {
                setActiveChallengeId(nextChallenge.id)
            }, 500) // Short delay for UX
        } else {
            // Mode complete
            setTimeout(() => {
                handleBack()
                showToast("Mode Complete!", "success")
            }, 1000)
        }
    }

    const handleBack = () => {
        setMode(null)
        setActiveChallengeId(null)
    }

    // Render Landing
    if (!mode || !activeChallenge) {
        return (
            <div className="min-h-screen bg-[#020204] pt-24 pb-12">
                <PlaygroundLanding
                    onSelectMode={handleSelectMode}
                    userLevel={userLevel}
                    userXp={xp}
                />
            </div>
        )
    }

    // Render Game Shell
    return (
        <div className="bg-[#020204] min-h-screen">
            <Toast
                message={toast.msg}
                type={toast.type}
                isVisible={toast.visible}
                onClose={() => setToast(prev => ({ ...prev, visible: false }))}
            />

            <GameShell
                title={activeChallenge.title}
                description={activeChallenge.description}
                xp={xp}
                level={userLevel}
                onBack={handleBack}
                onHowToPlay={() => setShowHowToPlay(true)}
            >
                {mode === 'fixer' && <ModeFixer challenge={activeChallenge as any} onComplete={handleComplete} />}
                {mode === 'builder' && <ModeBuilder challenge={activeChallenge as any} onComplete={handleComplete} />}
                {mode === 'battle' && <ModeBattle challenge={activeChallenge as any} onComplete={handleComplete} />}
                {mode === 'precision' && <ModePrecision challenge={activeChallenge as any} onComplete={handleComplete} />}
            </GameShell>

            {showHowToPlay && (
                <HowToPlay
                    mode={mode}
                    onClose={() => setShowHowToPlay(false)}
                />
            )}
        </div>
    )
}
