"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface Tab {
    id: string
    label: string
    icon: LucideIcon
}

interface AdminNavProps {
    tabs: Tab[]
    activeTab: string
    onTabChange: (id: string) => void
}

export function AdminNav({ tabs, activeTab, onTabChange }: AdminNavProps) {
    return (
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-1 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-colors z-10",
                                isActive ? "text-white" : "text-gray-400 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-brand-purple rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <tab.icon className="h-4 w-4 relative z-10" />
                            <span className="relative z-10">{tab.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
