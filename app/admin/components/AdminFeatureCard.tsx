"use client"

import React from "react"
import { LucideIcon, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminFeatureCardProps {
    title: string
    description: string
    icon: LucideIcon
    actionLabel?: string
    onClick?: () => void
    colorClass?: string // For gradient/icon colors
    delay?: string
    children?: React.ReactNode // For custom content like lists/composers
    className?: string
}

export function AdminFeatureCard({
    title,
    description,
    icon: Icon,
    actionLabel,
    onClick,
    colorClass = "text-brand-purple",
    delay = "delay-0",
    children,
    className
}: AdminFeatureCardProps) {
    return (
        <div className={cn(
            "group h-full p-8 rounded-[2rem] glass-panel border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] hover:border-brand-purple/30 transition-all duration-500 relative overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4",
            delay,
            className
        )}>
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-10 opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none">
                <Icon className={cn("h-32 w-32 -mr-10 -mt-10 opacity-10", colorClass)} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                    <div className={cn("h-14 w-14 rounded-2xl border flex items-center justify-center bg-white/5 border-white/10", colorClass)}>
                        <Icon className="h-7 w-7" />
                    </div>
                    {onClick && actionLabel && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                            <ArrowRight className="h-5 w-5 text-white/50" />
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">{title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">{description}</p>

                {/* Content Area (Slot) */}
                <div className="flex-1">
                    {children}
                </div>

                {/* Action Footer */}
                {actionLabel && onClick && (
                    <div className="mt-8 pt-6 border-t border-white/5">
                        <button
                            onClick={onClick}
                            className="flex items-center gap-2 text-sm font-semibold text-white group-hover:text-brand-purple transition-colors"
                        >
                            {actionLabel} <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
