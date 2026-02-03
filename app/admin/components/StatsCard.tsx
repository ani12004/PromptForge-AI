"use client"

import React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    change?: string
    trend?: "up" | "down" | "neutral"
    color?: string
}

export function StatsCard({ label, value, icon: Icon, change, trend, color = "text-brand-purple" }: StatsCardProps) {
    return (
        <div className="relative group overflow-hidden bg-[#0A0A0C]/80 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:border-brand-purple/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500 transform group-hover:scale-110">
                <Icon className={cn("h-24 w-24", color)} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className={cn("p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors", color)}>
                        <Icon className="h-5 w-5 text-current" />
                    </div>
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">{label}</span>
                </div>

                <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
                    {change && (
                        <span className={cn(
                            "text-xs font-semibold px-2 py-1 rounded-full mb-1 border",
                            trend === "up" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                                trend === "down" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                    "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        )}>
                            {change}
                        </span>
                    )}
                </div>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
    )
}
