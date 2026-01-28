"use client"

import * as React from "react"
import Link from "next/link"
import { useUser, useClerk } from "@clerk/nextjs"
import { Settings, User, LayoutDashboard, LogOut, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export function UserMenu({ showUpwards = false }: { showUpwards?: boolean }) {
    const { user } = useUser()
    const { signOut } = useClerk()
    const [isOpen, setIsOpen] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (!user) return null

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
            >
                <div className="h-8 w-8 rounded-full bg-brand-purple/20 border border-brand-purple/30 overflow-hidden relative">
                    {user.imageUrl ? (
                        <img
                            src={user.imageUrl}
                            alt={user.fullName || "User"}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-brand-purple text-xs font-bold">
                            {(user.firstName || user.username || "U").charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-white group-hover:text-brand-purple transition-colors">
                        {user.firstName || user.username}
                    </p>
                </div>
                <ChevronDown className={cn(
                    "h-4 w-4 text-gray-400 transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: showUpwards ? -10 : 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: showUpwards ? -10 : 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn(
                            "absolute right-0 w-64 p-2 rounded-xl bg-[#18181b] border border-white/10 shadow-xl overflow-hidden z-50",
                            showUpwards ? "bottom-full mb-2 origin-bottom-right" : "top-full mt-2 origin-top-right"
                        )}
                    >
                        <div className="px-3 py-3 border-b border-white/5 mb-2">
                            <p className="text-sm font-medium text-white truncate">
                                {user.fullName || user.username}
                            </p>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                {user.emailAddresses[0]?.emailAddress}
                            </p>
                        </div>

                        <div className="space-y-1">
                            <Link
                                href="/profile"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="h-4 w-4 text-gray-500 group-hover:text-brand-purple transition-colors" />
                                Profile
                            </Link>

                            <Link
                                href="/dashboard"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                onClick={() => setIsOpen(false)}
                            >
                                <LayoutDashboard className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                Dashboard
                            </Link>

                            <Link
                                href="/settings"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                onClick={() => setIsOpen(false)}
                            >
                                <Settings className="h-4 w-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                                Settings
                            </Link>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/5">
                            <button
                                onClick={() => signOut(() => { window.location.href = "/" })}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
                            >
                                <LogOut className="h-4 w-4 group-hover:text-red-400" />
                                Sign out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
