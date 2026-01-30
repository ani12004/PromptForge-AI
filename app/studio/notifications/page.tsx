import { getNotifications } from "@/app/actions/notifications"
import { Bell } from "lucide-react"

export default async function NotificationsPage() {
    const notifications = await getNotifications()

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-purple/10 rounded-xl border border-brand-purple/20">
                    <Bell className="w-6 h-6 text-brand-purple" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Notifications</h1>
                    <p className="text-gray-400">Updates, announcements, and alerts.</p>
                </div>
            </div>

            <div className="space-y-4">
                {notifications && notifications.length > 0 ? (
                    notifications.map((note: any) => (
                        <div key={note.id} className="bg-[#18181b] border border-white/10 p-6 rounded-xl hover:bg-white/[0.02] transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold text-white group-hover:text-brand-purple transition-colors">{note.title}</h3>
                                <span className="text-xs text-gray-500 font-mono">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{note.message}</p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 rounded-2xl border border-white/5 bg-white/[0.01] border-dashed">
                        <p className="text-gray-500">No notifications yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
