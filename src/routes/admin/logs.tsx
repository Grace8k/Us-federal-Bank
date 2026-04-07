import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'
import { ClipboardList } from 'lucide-react'

export const Route = createFileRoute('/admin/logs')({
  component: AdminLogsPage,
})

function AdminLogsPage() {
  const { adminLogs, users } = useBankingStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const getUserName = (id?: string) => id ? (users.find(u => u.id === id)?.name || id) : '—'

  const actionColors: Record<string, string> = {
    ADD_FUNDS: 'bg-green-900 text-green-300',
    DEDUCT_FUNDS: 'bg-red-900 text-red-300',
    UPDATE_USER: 'bg-blue-900 text-blue-300',
    UPDATE_SETTINGS: 'bg-purple-900 text-purple-300',
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Audit Logs</h1>

        {adminLogs.length === 0 ? (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
            <ClipboardList size={40} className="text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No audit logs yet. Admin actions will appear here.</p>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    {['Timestamp', 'Admin', 'Action', 'Target User', 'Details'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-slate-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminLogs.map(log => (
                    <tr key={log.id} className="border-b border-slate-700">
                      <td className="px-4 py-3 text-slate-400 text-xs">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-white text-xs">{log.adminEmail}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded ${actionColors[log.action] || 'bg-slate-700 text-slate-300'}`}>{log.action}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-xs">{getUserName(log.targetUserId)}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
