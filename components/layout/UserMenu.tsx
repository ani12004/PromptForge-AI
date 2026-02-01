"use client"

import * as React from "react"
import Link from "next/link"
import { useUser, useClerk } from "@clerk/nextjs"
import { Settings, User, LayoutDashboard, LogOut, ChevronDown, ShieldAlert } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { getUserSubscription } from "@/app/actions/subscription"
import { getUserRole } from "@/app/actions/auth"

interface UserMenuProps {
    withDropdown?: boolean;
    direction?: 'up' | 'down' | 'right';
}

export function UserMenu({ withDropdown = true, direction = 'up' }: UserMenuProps) {
    const { user } = useUser()
    const { signOut } = useClerk()
    const [isOpen, setIsOpen] = React.useState(false)
    const [tier, setTier] = React.useState<string | null>(null)
    const [role, setRole] = React.useState<string | null>(null)
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

    React.useEffect(() => {
        getUserSubscription().then(setTier)
        getUserRole().then(setRole)
    }, [])

    if (!user) return null

    const getMenuStyles = () => {
        switch (direction) {
            case 'right':
                return {
                    className: "absolute left-full ml-2 bottom-0 w-64 p-2 rounded-xl bg-[#18181b] border border-white/10 shadow-xl overflow-hidden z-50 origin-bottom-left",
                    initial: { opacity: 0, x: -10, scale: 0.95 },
                    animate: { opacity: 1, x: 0, scale: 1 },
                    exit: { opacity: 0, x: -10, scale: 0.95 }
                }
            case 'down':
                return {
                    className: "absolute top-full mt-2 right-0 w-64 p-2 rounded-xl bg-[#18181b] border border-white/10 shadow-xl overflow-hidden z-50 origin-top-right",
                    initial: { opacity: 0, y: -10, scale: 0.95 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: -10, scale: 0.95 }
                }
            case 'up':
            default:
                return {
                    className: "absolute bottom-full mb-2 left-0 w-full min-w-[200px] p-2 rounded-xl bg-[#18181b] border border-white/10 shadow-xl overflow-hidden z-50 origin-bottom-left",
                    initial: { opacity: 0, y: 10, scale: 0.95 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                    exit: { opacity: 0, y: 10, scale: 0.95 }
                }
        }
    }

    const menuConfig = getMenuStyles()

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => withDropdown && setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full bg-[#18181b] border border-white/5 transition-colors text-left w-full",
                    withDropdown ? "hover:border-white/10 cursor-pointer" : "cursor-default"
                )}
            >
                <div className="h-8 w-8 rounded-full bg-brand-purple/20 border border-brand-purple/30 overflow-hidden relative shrink-0">
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
                <div className="flex flex-col overflow-hidden hidden sm:flex">
                    <span className="text-sm font-medium text-white leading-none truncate">
                        {user.firstName || user.username}
                    </span>
                    <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider mt-0.5 whitespace-nowrap">
                        {tier === 'pro' ? 'PRO PLAN' : 'FREE PLAN'}
                    </span>
                </div>
                {withDropdown && (
                    <ChevronDown className={cn(
                        "h-4 w-4 text-gray-400 ml-1 transition-transform duration-200 shrink-0",
                        isOpen && "rotate-180"
                    )} />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={menuConfig.initial}
                        animate={menuConfig.animate}
                        exit={menuConfig.exit}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={menuConfig.className}
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

                            {role === 'admin' && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <ShieldAlert className="h-4 w-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                                    Admin Panel
                                </Link>
                            )}

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
