import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { DashboardLayout } from '@/components/DashboardLayout'
import { Bell, CheckCheck } from 'lucide-react'

export const Route = createFileRoute('/dashboard/notifications')({
  component: NotificationsPage,
})

function NotificationsPage() {
  const { currentUser, notifications, markNotificationRead, markAllNotificationsRead } = useBankingStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted || !currentUser) return null

  const userNotifs = notifications.filter(n => n.userId === currentUser.id)
  const unread = userNotifs.filter(n => !n.read).length

  const typeColors: Record<string, string> = {
    success: 'bg-green-50 border-l-4 border-green-500',
    error: 'bg-red-50 border-l-4 border-red-500',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500',
    info: 'bg-blue-50 border-l-4 border-blue-500',
  }
  const typeIcons: Record<string, string> = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' }

  return (
    <DashboardLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#1e3a5f' }}>Notifications</h1>
            {unread > 0 && <p className="text-sm text-gray-500">{unread} unread notification{unread > 1 ? 's' : ''}</p>}
          </div>
          {unread > 0 && (
            <button onClick={() => markAllNotificationsRead(currentUser.id)}
              style={{ color: '#1e3a5f' }} className="flex items-center gap-2 text-sm hover:underline">
              <CheckCheck size={16} /> Mark all as read
            </button>
          )}
        </div>

        {userNotifs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Bell size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {userNotifs.map(notif => (
              <div
                key={notif.id}
                className={`rounded-xl p-4 cursor-pointer transition-opacity ${typeColors[notif.type] || 'bg-gray-50 border-l-4 border-gray-400'} ${notif.read ? 'opacity-60' : ''}`}
                onClick={() => markNotificationRead(notif.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{typeIcons[notif.type]}</span>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{notif.title}</div>
                      <div className="text-gray-600 text-sm mt-0.5">{notif.message}</div>
                      <div className="text-gray-400 text-xs mt-1">{new Date(notif.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
