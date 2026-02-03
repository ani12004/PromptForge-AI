"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Mail, BarChart3, Send, Loader2, Activity, Settings, ArrowRight, Bell, Shield, Filter, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAdminStats, getUsers, getContactMessages, sendBroadcastNotification, updateMessageStatus, sendEmailReply } from "./actions"
import { useActionState } from "react"
import { StatsCard } from "./components/StatsCard"
import { AdminFeatureCard } from "./components/AdminFeatureCard"
import { SystemMonitor } from "./components/SystemMonitor"

export default function AdminDashboard() {
    const [stats, setStats] = React.useState<any>(null)
    const [users, setUsers] = React.useState<any[]>([])
    const [messages, setMessages] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)
    const [view, setView] = React.useState<"dashboard" | "users" | "messages">("dashboard")

    // Broadcast form state
    const [broadcastState, broadcastAction, isBroadcasting] = useActionState(sendBroadcastNotification, null)

    const [selectedMessage, setSelectedMessage] = React.useState<any>(null)
    const [replyMode, setReplyMode] = React.useState(false)
    const [replyContent, setReplyContent] = React.useState("")
    const [sendingReply, setSendingReply] = React.useState(false)

    // Reset when modal closes
    React.useEffect(() => {
        if (!selectedMessage) {
            setReplyMode(false)
            setReplyContent("")
        }
    }, [selectedMessage])

    const handleMarkAsRead = async (id: string) => {
        await updateMessageStatus(id, 'read')
        // Optimistic update
        setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status: 'read' } : m))
        setSelectedMessage(null)
    }

    const handleSendReply = async () => {
        if (!replyContent.trim()) return

        setSendingReply(true)
        const res = await sendEmailReply(
            selectedMessage.email,
            selectedMessage.subject,
            selectedMessage.message,
            replyContent
        )
        setSendingReply(false)

        if (res.error) {
            alert("Failed to send reply: " + res.error)
        } else {
            alert("Reply sent successfully!")
            setSelectedMessage(null) // Close modal
        }
    }

    React.useEffect(() => {
        const loadmv = async () => {
            setLoading(true)
            const s = await getAdminStats()
            const u = await getUsers()
            const m = await getContactMessages()
            setStats(s)
            setUsers(u || [])
            setMessages(m || [])
            setLoading(false)
        }
        loadmv()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-purple/20 blur-xl rounded-full" />
                    <Loader2 className="h-12 w-12 animate-spin text-brand-purple relative z-10" />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-12">
            {/* Hero Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-indigo-400">Admin</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        You have <span className="text-white font-semibold">{stats?.unreadMessages || 0} unread messages</span> and system status is <span className="text-emerald-400 font-semibold">Optimal</span>.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setView(view === 'dashboard' ? 'users' : 'dashboard')}
                        className="px-6 py-3 bg-white/5 text-white rounded-xl font-semibold hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2"
                    >
                        {view === 'dashboard' ? 'Manage Users' : 'Back to Dashboard'}
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {view === "dashboard" && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-12"
                    >
                        {/* KPI Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard label="Total Users" value={stats?.totalUsers} icon={Users} trend="up" change="+12%" />
                            <StatsCard label="Active Messages" value={stats?.totalMessages} icon={Mail} color="text-blue-400" />
                            <StatsCard label="Pending Review" value={stats?.unreadMessages} icon={Bell} trend="neutral" change="2 new" color="text-amber-400" />
                            <StatsCard label="System Health" value="99.9%" icon={Activity} trend="up" color="text-emerald-400" />
                        </div>

                        {/* Feature Cards Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Messages Inbox Card */}
                            <AdminFeatureCard
                                title="Messages"
                                description="Recent inquiries not yet addressed."
                                icon={Mail}
                                colorClass="text-blue-500 bg-blue-500/10 border-blue-500/20"
                                className="lg:col-span-2"
                            >
                                <div className="mt-4 space-y-2">
                                    {messages.slice(0, 3).map((msg: any) => (
                                        <div
                                            key={msg.id}
                                            onClick={() => setSelectedMessage(msg)}
                                            className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors cursor-pointer group"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">
                                                {msg.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline">
                                                    <h4 className="text-white font-medium truncate group-hover:text-blue-400 transition-colors">{msg.subject}</h4>
                                                    <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-400 text-sm truncate">{msg.message}</p>
                                            </div>
                                            {msg.status === 'unread' && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                                        </div>
                                    ))}
                                    {messages.length === 0 && <p className="text-gray-500">No new messages.</p>}
                                </div>
                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <button onClick={() => setView("messages")} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                                        View All Inbox <ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </AdminFeatureCard>

                            {/* System Status Card */}
                            <AdminFeatureCard
                                title="System Status"
                                description="Real-time performance metrics."
                                icon={Activity}
                                colorClass="text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                            >
                                <div className="space-y-4 mt-2">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-sm font-medium text-emerald-100">API Gateway</span>
                                        </div>
                                        <span className="text-xs text-emerald-400 font-mono">24ms</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-sm font-medium text-emerald-100">Database</span>
                                        </div>
                                        <span className="text-xs text-emerald-400 font-mono">12ms</span>
                                    </div>
                                </div>
                            </AdminFeatureCard>

                            {/* Broadcast Card */}
                            <AdminFeatureCard
                                title="Broadcast"
                                description="Send global notifications."
                                icon={Send}
                                colorClass="text-brand-purple bg-brand-purple/10 border-brand-purple/20"
                                className="lg:col-span-3"
                            >
                                <form action={broadcastAction} className="mt-4 flex flex-col md:flex-row gap-4 items-start">
                                    <div className="flex-1 w-full space-y-3">
                                        <input
                                            name="subject"
                                            required
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all"
                                            placeholder="Announcement Title"
                                        />
                                        <textarea
                                            name="message"
                                            required
                                            rows={2}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all resize-none"
                                            placeholder="Message to all users..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isBroadcasting}
                                        className="h-full min-h-[120px] px-8 bg-brand-purple hover:bg-brand-purple/90 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-brand-purple/25 flex flex-col items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isBroadcasting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
                                        <span>Publish</span>
                                    </button>
                                </form>
                                {broadcastState?.message && (
                                    <p className="mt-2 text-green-400 text-sm">{broadcastState.message}</p>
                                )}
                            </AdminFeatureCard>

                        </div>
                    </motion.div>
                )}

                {view === "users" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-[#0A0A0C]/80 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setView("dashboard")} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ArrowRight className="h-5 w-5 text-gray-400 rotate-180" /></button>
                                <h2 className="text-xl font-bold text-white">User Management</h2>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input placeholder="Search users..." className="pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple" />
                            </div>
                        </div>
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="bg-white/[0.02] text-gray-200 font-medium border-b border-white/5">
                                <tr>
                                    <th className="p-6">User</th>
                                    <th className="p-6">Status</th>
                                    <th className="p-6">Joined</th>
                                    <th className="p-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {users.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6 flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-brand-purple to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                                                {user.full_name?.[0]}
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold">{user.full_name || "Unknown"}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="p-6"><span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs border border-emerald-500/20">Active</span></td>
                                        <td className="p-6">{new Date(user.created_at).toLocaleDateString()}</td>
                                        <td className="p-6 text-right">
                                            <button className="text-gray-400 hover:text-white transition-colors">Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Reused Modal Logic */}
            <AnimatePresence>
                {selectedMessage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMessage(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#0A0A0C] border border-white/10 rounded-3xl shadow-2xl overflow-hidden glass-panel"
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">{selectedMessage.subject}</h3>
                                        <p className="text-brand-purple">{selectedMessage.email}</p>
                                    </div>
                                    <button onClick={() => setSelectedMessage(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><ArrowRight className="text-white h-6 w-6" /></button>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mb-8 text-gray-300 leading-relaxed">
                                    {selectedMessage.message}
                                </div>

                                {replyMode ? (
                                    <div className="space-y-4">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-1 focus:ring-brand-purple"
                                            rows={5}
                                            placeholder="Write your reply..."
                                            autoFocus
                                        />
                                        <div className="flex gap-4">
                                            <button onClick={() => setReplyMode(false)} className="flex-1 py-3 text-gray-400 hover:text-white">Cancel</button>
                                            <button onClick={handleSendReply} className="flex-1 py-3 bg-brand-purple text-white rounded-xl font-semibold hover:bg-brand-purple/90">Send Reply</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-4">
                                        <button onClick={() => setReplyMode(true)} className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors">Reply</button>
                                        {selectedMessage.status === 'unread' && (
                                            <button onClick={() => handleMarkAsRead(selectedMessage.id)} className="flex-1 py-3 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/5 transition-colors">Mark Read</button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
