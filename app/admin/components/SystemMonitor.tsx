"use client"

import React from "react"
import { Activity, Server, Database, Shield, Radio, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export function SystemMonitor() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: '0.2s' }}>
            {/* Real-time Status */}
            <div className="col-span-2 bg-[#0A0A0C]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-400" />
                        System Status
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs font-semibold text-emerald-400">ALL SYSTEMS GO</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatusTile icon={Server} label="API Gateway" status="Operational" ping />
                    <StatusTile icon={Database} label="Supabase DB" status="Operational" ping />
                    <StatusTile icon={Shield} label="Clerk Auth" status="Operational" ping />
                </div>

                {/* Background Grid Decoration */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            </div>

            {/* Quick Actions */}
            <div className="bg-[#0A0A0C]/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <Radio className="h-5 w-5 text-brand-purple" />
                    Controls
                </h3>

                <div className="space-y-4">
                    <ControlRow label="Maintenance Mode" description="Disable user access" />
                    <ControlRow label="Debug Logging" description="Verbose system logs" />
                    <ControlRow label="API Throttling" description="Limit request rate" active />
                </div>
            </div>
        </div>
    )
}

function StatusTile({ icon: Icon, label, status, ping }: any) {
    return (
        <div className="group relative bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/[0.07] transition-colors">
            <div className="flex items-start justify-between mb-2">
                <Icon className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                {ping && (
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                )}
            </div>
            <div className="text-sm font-medium text-gray-300 mb-0.5">{label}</div>
            <div className="text-xs text-emerald-400 font-semibold tracking-wide uppercase">{status}</div>
        </div>
    )
}

function ControlRow({ label, description, active = false }: any) {
    const [isOn, setIsOn] = React.useState(active)

    return (
        <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
            <div>
                <div className="text-sm font-medium text-white">{label}</div>
                <div className="text-xs text-gray-500">{description}</div>
            </div>
            <button
                onClick={() => setIsOn(!isOn)}
                className={cn(
                    "w-10 h-5 rounded-full p-0.5 transition-all duration-300",
                    isOn ? "bg-brand-purple shadow-glow" : "bg-white/10"
                )}
            >
                <div className={cn(
                    "w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300",
                    isOn ? "translate-x-5" : "translate-x-0"
                )} />
            </button>
        </div>
    )
}
