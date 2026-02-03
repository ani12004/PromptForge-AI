"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Shield, Trash2, Ban, X, Check, Save } from "lucide-react"
import { updateUserSubscription, banUser, deleteUser } from "../actions"

interface UserEditModalProps {
    user: any
    onClose: () => void
    onUpdate: () => void
}

export function UserEditModal({ user, onClose, onUpdate }: UserEditModalProps) {
    const [tier, setTier] = useState<'free' | 'pro'>(user.subscription_tier || 'free')
    const [isLoading, setIsLoading] = useState(false)
    const [actionMessage, setActionMessage] = useState("")

    const handleSave = async () => {
        setIsLoading(true)
        const res = await updateUserSubscription(user.id, tier)
        setIsLoading(false)
        if (res.error) {
            alert(res.error)
        } else {
            setActionMessage("Subscription Updated!")
            setTimeout(() => {
                onUpdate()
                onClose()
            }, 1000)
        }
    }

    const handleBan = async () => {
        if (!confirm("Are you sure you want to BAN this user? This will prevent them from logging in.")) return
        setIsLoading(true)
        const res = await banUser(user.id)
        setIsLoading(false)
        if (res.error) {
            alert(res.error)
        } else {
            setActionMessage("User Banned")
            setTimeout(() => {
                onUpdate()
                onClose()
            }, 1000)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to DELETE this user? This is irreversible.")) return
        setIsLoading(true)
        const res = await deleteUser(user.id)
        setIsLoading(false)
        if (res.error) {
            alert(res.error)
        } else {
            setActionMessage("User Deleted")
            setTimeout(() => {
                onUpdate()
                onClose()
            }, 1000)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Edit User</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-brand-purple to-indigo-500 flex items-center justify-center text-white font-bold text-lg">
                            {user.full_name?.[0]}
                        </div>
                        <div>
                            <div className="text-white font-semibold">{user.full_name || "Unknown"}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subscription Tier</label>
                        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                            <button
                                onClick={() => setTier('free')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tier === 'free' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
                            >
                                Free
                            </button>
                            <button
                                onClick={() => setTier('pro')}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tier === 'pro' ? 'bg-brand-purple text-white shadow-sm' : 'text-gray-400 hover:text-gray-300'}`}
                            >
                                Pro
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-white/5">
                        <label className="text-xs font-semibold text-red-400/80 uppercase tracking-wider">Danger Zone</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleBan}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium"
                            >
                                <Ban className="h-4 w-4" /> Ban User
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-500/10 border border-gray-500/20 text-gray-400 rounded-xl hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
                            >
                                <Trash2 className="h-4 w-4" /> Delete
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                    {actionMessage ? (
                        <span className="text-green-400 text-sm font-medium flex items-center gap-2">
                            <Check className="h-4 w-4" /> {actionMessage}
                        </span>
                    ) : (
                        <span />
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
