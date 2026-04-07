import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'
import { Plus, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/admin/notifications')({
  component: AdminNotificationsPage,
})

function AdminNotificationsPage() {
  const { users, notifications, addNotification } = useBankingStore()
  const [form, setForm] = useState({ userId: 'all', title: '', message: '', type: 'info' as 'info' | 'success' | 'warning' | 'error' })
  const [sent, setSent] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.userId === 'all') {
      users.forEach(u => addNotification({ userId: u.id, title: form.title, message: form.message, type: form.type, read: false }))
    } else {
      addNotification({ userId: form.userId, title: form.title, message: form.message, type: form.type, read: false })
    }
    setSent(true)
    setForm({ userId: 'all', title: '', message: '', type: 'info' })
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-white mb-6">Send Notifications</h1>

        {sent && (
          <div className="mb-4 p-4 bg-green-900 border border-green-700 rounded-xl flex items-center gap-3">
            <CheckCircle size={18} className="text-green-400" />
            <span className="text-green-300">Notification sent successfully!</span>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Plus size={16} /> Create Notification
          </h3>
          <form onSubmit={handleSend} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Send To</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none">
                <option value="all">All Customers (Broadcast)</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type }))}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none">
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Alert</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Title</label>
              <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none" placeholder="Notification title" />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Message</label>
              <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={4}
                className="w-full px-3 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none resize-none" placeholder="Notification message..." />
            </div>
            <button type="submit" style={{ backgroundColor: '#c9a227' }} className="w-full py-3 rounded-lg text-white font-semibold hover:opacity-90">
              Send Notification
            </button>
          </form>
        </div>

        {/* Recent notifications */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <h3 className="text-white font-semibold">Recent Notifications ({notifications.length})</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 20).map(n => (
              <div key={n.id} className="px-4 py-3 border-b border-slate-700">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white text-sm font-medium">{n.title}</div>
                    <div className="text-slate-400 text-xs">{n.message.slice(0, 80)}{n.message.length > 80 ? '...' : ''}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${n.type === 'success' ? 'bg-green-900 text-green-300' : n.type === 'error' ? 'bg-red-900 text-red-300' : n.type === 'warning' ? 'bg-yellow-900 text-yellow-300' : 'bg-blue-900 text-blue-300'}`}>{n.type}</span>
                    <span className="text-slate-500 text-xs">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
