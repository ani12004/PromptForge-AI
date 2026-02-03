"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Mail, BarChart3, Send, Loader2, Activity, Settings, ArrowUpRight, Search, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
// We will simple fetch on load for simplicity in this V1
import { getAdminStats, getUsers, getContactMessages, sendBroadcastNotification, updateMessageStatus, sendEmailReply } from "./actions"
import { useActionState } from "react"
import { AdminNav } from "./components/AdminNav"
import { StatsCard } from "./components/StatsCard"
import { SystemMonitor } from "./components/SystemMonitor"

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

    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "users", label: "Users", icon: Users },
        { id: "messages", label: "Messages", icon: Mail },
        { id: "broadcast", label: "Broadcast", icon: Send },
        { id: "system", label: "System", icon: Settings },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-purple/20 blur-xl rounded-full" />
                    <Loader2 className="h-12 w-12 animate-spin text-brand-purple relative z-10" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Tabs */}
            <AdminNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                >
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard label="Total Users" value={stats?.totalUsers} icon={Users} trend="up" change="+12% this week" />
                            <StatsCard label="Messages" value={stats?.totalMessages} icon={Mail} color="text-blue-400" />
                            <StatsCard label="Unread" value={stats?.unreadMessages} icon={Mail} trend="neutral" color="text-amber-400" />
                            <StatsCard label="System Status" value="Healthy" icon={Activity} trend="up" color="text-emerald-400" />
                        </div>
                    )}

                    {activeTab === "users" && (
                        <div className="bg-[#0A0A0C]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        placeholder="Search users..."
                                        className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-brand-purple"
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-gray-400 transition-colors">
                                    <Filter className="h-4 w-4" /> Filter
                                </button>
                            </div>

                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="bg-white/5 text-gray-200 font-medium">
                                    <tr>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Email</th>
                                        <th className="p-4">Joined</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-brand-purple/5 transition-colors group">
                                            <td className="p-4 text-white font-medium flex items-center gap-3">
                                                {user.avatar_url ? (
                                                    <img src={user.avatar_url} alt="" className="h-10 w-10 rounded-full border border-white/10 object-cover" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-linear-to-tr from-brand-purple to-blue-500 flex items-center justify-center text-xs text-white font-bold">{user.full_name?.[0]}</div>
                                                )}
                                                <div>
                                                    <div className="font-semibold text-white">{user.full_name || "N/A"}</div>
                                                    <div className="text-xs text-brand-purple/80">{user.id.slice(0, 8)}...</div>
                                                </div>
                                            </td>
                                            <td className="p-4">{user.email}</td>
                                            <td className="p-4">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                                            <td className="p-4 text-right">
                                                <button className="text-xs font-semibold bg-white/5 hover:bg-white/10 hover:text-white px-3 py-1.5 rounded-full border border-white/10 transition-colors">Manage</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {users.length === 0 && <div className="p-12 text-center text-gray-500">No users found</div>}
                        </div>
                    )}

                    {activeTab === "messages" && (
                        <div className="bg-[#0A0A0C]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                                <h3 className="font-semibold text-white">Inbox</h3>
                            </div>
                            <div className="divide-y divide-white/5">
                                {messages.map((msg: any) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={cn(
                                            "flex items-center gap-4 p-4 hover:bg-white/[0.03] cursor-pointer transition-all group border-l-2",
                                            msg.status === 'unread' ? "border-l-brand-purple bg-brand-purple/[0.02]" : "border-l-transparent"
                                        )}
                                    >
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center shrink-0">
                                            <Mail className={cn("h-5 w-5", msg.status === 'unread' ? "text-brand-purple" : "text-gray-500")} />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={cn("text-sm font-medium truncate", msg.status === 'unread' ? "text-white" : "text-gray-400")}>{msg.name}</span>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(msg.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <h4 className={cn("text-sm truncate mb-0.5", msg.status === 'unread' ? "text-white font-semibold" : "text-gray-300")}>{msg.subject}</h4>
                                            <p className="text-xs text-gray-500 truncate max-w-md opacity-80 group-hover:opacity-100">{msg.message}</p>
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && <div className="p-12 text-center text-gray-500">No messages found</div>}
                            </div>
                        </div>
                    )}

                    {activeTab === "broadcast" && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-[#0A0A0C]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20">
                                            <Send className="h-6 w-6 text-brand-purple" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white">Broadcast</h2>
                                            <p className="text-sm text-gray-400">Send global notifications to all users</p>
                                        </div>
                                    </div>

                                    <form action={broadcastAction} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</label>
                                            <input
                                                name="subject"
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all"
                                                placeholder="e.g. New Features Available"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Message</label>
                                            <textarea
                                                name="message"
                                                required
                                                rows={5}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-purple transition-all resize-none"
                                                placeholder="Type your announcement here..."
                                            />
                                        </div>

                                        {broadcastState?.error && (
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-red-500" /> {broadcastState.error}
                                            </div>
                                        )}
                                        {broadcastState?.success && (
                                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> {broadcastState.message}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isBroadcasting}
                                            className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-brand-purple/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                                        >
                                            {isBroadcasting ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Publishing...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                                    Publish Notification
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "system" && <SystemMonitor />}

                </motion.div>
            </AnimatePresence>

            {/* Message Modal */}
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
                            className="relative w-full max-w-2xl bg-[#0A0A0C] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold text-lg">
                                        {selectedMessage.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold">{selectedMessage.subject}</h3>
                                        <p className="text-sm text-gray-400">{selectedMessage.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-8 max-h-[60vh] overflow-y-auto">
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.message}</p>
                            </div>

                            <div className="p-6 bg-white/[0.02] border-t border-white/5">
                                {replyMode ? (
                                    <div className="space-y-4">
                                        <textarea
                                            value={replyContent}
                                            onChange={(e) => setReplyContent(e.target.value)}
                                            placeholder="Write your reply..."
                                            rows={6}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-brand-purple resize-none"
                                            autoFocus
                                        />
                                        <div className="flex items-center gap-3 justify-end">
                                            <button
                                                onClick={() => setReplyMode(false)}
                                                disabled={sendingReply}
                                                className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSendReply}
                                                disabled={sendingReply || !replyContent.trim()}
                                                className="bg-brand-purple hover:bg-brand-purple/90 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-brand-purple/20 flex items-center gap-2 disabled:opacity-50"
                                            >
                                                {sendingReply ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                Send Reply
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setReplyMode(true)}
                                            className="flex-1 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-4 h-4" /> Reply
                                        </button>
                                        {selectedMessage.status === 'unread' && (
                                            <button
                                                onClick={() => handleMarkAsRead(selectedMessage.id)}
                                                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-xl border border-white/10 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Mail className="w-4 h-4" /> Mark as Read
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
