"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Mail, BarChart3, Send, Loader2, Activity, Settings, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
// We will simple fetch on load for simplicity in this V1
import { getAdminStats, getUsers, getContactMessages, sendBroadcastNotification, updateMessageStatus, sendEmailReply } from "./actions"
import { useActionState } from "react"

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = React.useState("overview")
    const [stats, setStats] = React.useState<any>(null)
    const [users, setUsers] = React.useState<any[]>([])
    const [messages, setMessages] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

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

    // NEW: System Controls State (Mock)
    const [maintenanceMode, setMaintenanceMode] = React.useState(false)
    const [apiStatus, setApiStatus] = React.useState("operational")

    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "users", label: "Users", icon: Users },
        { id: "messages", label: "Messages", icon: Mail },
        { id: "broadcast", label: "Broadcast", icon: Send },
        { id: "system", label: "System", icon: Settings }, // NEW TAB
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
                <p className="text-gray-400">Manage users, deployments, and system health.</p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl w-fit border border-white/10">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            activeTab === tab.id
                                ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatsCard label="Total Users" value={stats?.totalUsers} icon={Users} color="text-blue-400" bg="bg-blue-400/10" />
                            <StatsCard label="Total Messages" value={stats?.totalMessages} icon={Mail} color="text-green-400" bg="bg-green-400/10" />
                            <StatsCard label="Unread Messages" value={stats?.unreadMessages} icon={Mail} color="text-red-400" bg="bg-red-400/10" />
                            <StatsCard label="System Status" value="Healthy" icon={Activity} color="text-emerald-400" bg="bg-emerald-400/10" />
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="bg-[#18181b] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-white/5 text-gray-200 font-medium border-b border-white/5">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Joined</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-white/[0.02]">
                                            <td className="p-4 text-white font-medium flex items-center gap-3">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full border border-white/10" />
                                                ) : (
                                                    <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs">{user.full_name?.[0]}</div>
                                                )}
                                                {user.full_name || "N/A"}
                                            </td>
                                            <td className="p-4">{user.email}</td>
                                            <td className="p-4">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                                            <td className="p-4">
                                                <button className="text-xs bg-white/5 hover:bg-white/10 px-2 py-1 rounded border border-white/10 text-gray-300">View Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && <div className="p-8 text-center">No users found</div>}
                        </div>
                    )}

                    {activeTab === "messages" && (
                        <div className="bg-[#18181b] border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                            {/* ... (Same as before) ... */}
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-white/5 text-gray-200 font-medium">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">From</th>
                                        <th className="p-4">Subject</th>
                                        <th className="p-4">Message</th>
                                        <th className="p-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {messages.map((msg: any) => (
                                        <tr
                                            key={msg.id}
                                            onClick={() => setSelectedMessage(msg)}
                                            className="hover:bg-white/[0.02] cursor-pointer transition-colors group"
                                        >
                                            <td className="p-4 whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <div className="text-white font-medium group-hover:text-brand-purple transition-colors">{msg.name}</div>
                                                <div className="text-xs text-gray-500">{msg.email}</div>
                                            </td>
                                            <td className="p-4 text-white group-hover:text-white/90">{msg.subject}</td>
                                            <td className="p-4 max-w-xs truncate text-gray-500">{msg.message}</td>
                                            <td className="p-4">
                                                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                    msg.status === 'unread' ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-green-500/10 text-green-400 border border-green-500/20"
                                                )}>
                                                    {msg.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {messages.length === 0 && <div className="p-8 text-center text-gray-500">No messages found</div>}
                        </div>
                    )}

                    {activeTab === "broadcast" && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-[#18181b] border border-white/10 rounded-xl p-6 shadow-2xl">
                                {/* ... (Same as before) ... */}
                                <h2 className="text-xl font-semibold mb-4 text-white">Publish Global Notification</h2>
                                <p className="text-gray-400 mb-6 text-sm">
                                    This will appear in the Notifications sidebar for <strong>ALL</strong> users.
                                </p>

                                <form action={broadcastAction} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                        <input
                                            name="subject"
                                            required
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                                            placeholder="New Feature Alert"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={6}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
                                            placeholder="We have just launched..."
                                        />
                                    </div>

                                    {broadcastState?.error && (
                                        <p className="text-red-400 text-sm">{broadcastState.error}</p>
                                    )}
                                    {broadcastState?.success && (
                                        <p className="text-green-400 text-sm">{broadcastState.message}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isBroadcasting}
                                        className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        {isBroadcasting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Publishing...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-4 w-4" />
                                                Publish Notification
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/** NEW SYSTEM TAB **/}
                    {activeTab === "system" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* System Status Mock */}
                            <div className="bg-[#18181b] border border-white/10 rounded-xl p-6 shadow-2xl space-y-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-emerald-400" /> System Health
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-gray-300 font-medium">API Gateway</span>
                                        </div>
                                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">OPERATIONAL</span>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-gray-300 font-medium">Database (Supabase)</span>
                                        </div>
                                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">OPERATIONAL</span>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-gray-300 font-medium">Auth (Clerk)</span>
                                        </div>
                                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">OPERATIONAL</span>
                                    </div>
                                </div>
                            </div>

                            {/* Controls & Quick Links */}
                            <div className="space-y-6">
                                <div className="bg-[#18181b] border border-white/10 rounded-xl p-6 shadow-2xl">
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                                        <Settings className="h-5 w-5 text-brand-purple" /> Controls
                                    </h3>

                                    <div className="flex items-center justify-between mb-6">
                                        <div className="space-y-1">
                                            <div className="text-white font-medium">Maintenance Mode</div>
                                            <div className="text-xs text-gray-500">Disable access for non-admins</div>
                                        </div>
                                        <button
                                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                                            className={cn("w-12 h-6 rounded-full p-1 transition-colors", maintenanceMode ? "bg-brand-purple" : "bg-white/10")}
                                        >
                                            <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-transform", maintenanceMode ? "translate-x-6" : "translate-x-0")} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                        <div className="space-y-1">
                                            <div className="text-white font-medium">Global Cache</div>
                                            <div className="text-xs text-gray-500">Clear all server-side caches</div>
                                        </div>
                                        <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded border border-white/10 transition-colors">
                                            Clear Cache
                                        </button>
                                    </div>
                                </div>

                                {/* Changelog Link Card */}
                                <a
                                    href="/changelog"
                                    target="_blank"
                                    className="block bg-gradient-to-br from-brand-purple/20 to-brand-purple/5 border border-brand-purple/20 rounded-xl p-6 hover:border-brand-purple/40 transition-colors group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-white group-hover:text-brand-purple transition-colors">View Changelog</h3>
                                        <ArrowUpRight className="h-5 w-5 text-gray-500 group-hover:text-brand-purple" />
                                    </div>
                                    <p className="text-sm text-gray-400">Review the public facing release notes for v1.3.0 and prior.</p>
                                </a>
                            </div>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>

            {/* Message Details Modal (Reused) */}
            <AnimatePresence>
                {selectedMessage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedMessage(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{selectedMessage.subject}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <span>{new Date(selectedMessage.created_at).toLocaleString()}</span>
                                        <span>•</span>
                                        <span className={cn(
                                            "uppercase text-[10px] font-bold px-1.5 py-0.5 rounded border",
                                            selectedMessage.status === 'unread' ? "text-red-400 border-red-500/20 bg-red-500/10" : "text-green-400 border-green-500/20 bg-green-500/10 "
                                        )}>{selectedMessage.status}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">From</span>
                                        {selectedMessage.user_id && <span className="text-xs font-mono text-gray-600">ID: {selectedMessage.user_id}</span>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold">
                                            {selectedMessage.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{selectedMessage.name}</div>
                                            <div className="text-sm text-brand-purple hover:underline cursor-pointer" onClick={() => window.open(`mailto:${selectedMessage.email}`)}>
                                                {selectedMessage.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Message</span>
                                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {selectedMessage.message}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                {replyMode ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write your reply..."
                                            rows={4}
                                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 resize-none"
                                            autoFocus
                                        />
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={handleSendReply}
                                                disabled={sendingReply || !replyContent.trim()}
                                                className="flex-1 bg-white text-black font-semibold py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {sendingReply ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Send className="h-4 w-4" />
                                                )}
                                                Send Reply
                                            </button>
                                            <button
                                                onClick={() => setReplyMode(false)}
                                                disabled={sendingReply}
                                                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setReplyMode(true)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-white text-black font-semibold py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                                        >
                                            <Send className="w-4 h-4" />
                                            Reply
                                        </button>
                                        {selectedMessage.status === 'unread' && (
                                            <button
                                                onClick={() => handleMarkAsRead(selectedMessage.id)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-semibold py-2.5 rounded-xl border border-white/10 transition-colors"
                                            >
                                                <Mail className="w-4 h-4" />
                                                Mark as Read
                                            </button>
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

function StatsCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-[#18181b] border border-white/10 p-6 rounded-xl flex items-center gap-4">
            <div className={cn("p-3 rounded-lg", bg)}>
                <Icon className={cn("h-6 w-6", color)} />
            </div>
            <div>
                <p className="text-sm text-gray-400">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    )
}
