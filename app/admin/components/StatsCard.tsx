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
        <div className="group p-6 rounded-[2rem] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-4">
                <div className={cn("h-12 w-12 rounded-2xl border flex items-center justify-center transition-colors",
                    "bg-white/5 border-white/10 text-gray-400 group-hover:text-white group-hover:border-white/20"
                )}>
                    <Icon className="h-6 w-6" />
                </div>
                {change && (
                    <span className={cn(
                        "text-[10px] font-bold tracking-wider font-mono px-2 py-1 rounded-full border",
                        trend === "up" ? "text-green-400 bg-green-500/10 border-green-500/20" :
                            trend === "down" ? "text-red-400 bg-red-500/10 border-red-500/20" :
                                "text-gray-500 bg-white/5 border-white/5"
                    )}>
                        {change}
                    </span>
                )}
            </div>

            <div>
                <p className="text-sm text-gray-400 font-medium mb-1">{label}</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
            </div>
        </div>
    )
}
