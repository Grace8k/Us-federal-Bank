import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'
import { Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
})

function AdminPage() {
  const { users, transactions, loans } = useBankingStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const totalBalance = users.reduce((s, u) => s + u.balance, 0)
  const totalTxVolume = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0)
  const pendingLoans = loans.filter(l => l.status === 'pending').length
  const activeUsers = users.filter(u => u.status === 'active').length

  const stats = [
    { label: 'Total Customers', value: users.length, icon: Users, color: '#1e3a5f', sub: `${activeUsers} active` },
    { label: 'Total Deposits', value: `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#059669', sub: 'All accounts' },
    { label: 'Transaction Volume', value: `$${totalTxVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: '#7c3aed', sub: `${transactions.length} total` },
    { label: 'Pending Loans', value: pendingLoans, icon: AlertTriangle, color: '#d97706', sub: 'Needs review' },
  ]

  const recentTxs = transactions.slice(0, 8)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Overview</h1>
          <p className="text-slate-400 text-sm">United State Federal Bank — Administration Dashboard</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <div style={{ backgroundColor: color + '25' }} className="w-10 h-10 rounded-lg flex items-center justify-center">
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-slate-400 text-xs mt-0.5">{label}</div>
              <div className="text-slate-500 text-xs">{sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700">
              <h3 className="text-white font-semibold">Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="px-4 py-2 text-left text-slate-400 font-medium">Description</th>
                    <th className="px-4 py-2 text-right text-slate-400 font-medium">Amount</th>
                    <th className="px-4 py-2 text-center text-slate-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTxs.map(tx => (
                    <tr key={tx.id} className="border-b border-slate-700">
                      <td className="px-4 py-2 text-slate-300">{tx.description}</td>
                      <td className="px-4 py-2 text-right text-white font-medium">${tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-xs ${tx.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>{tx.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Status */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700">
              <h3 className="text-white font-semibold">Customer Accounts</h3>
            </div>
            <div className="p-4 space-y-3">
              {users.slice(0, 8).map(user => (
                <div key={user.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{user.name}</div>
                      <div className="text-slate-400 text-xs">{user.accountNumber}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">${user.balance.toFixed(2)}</div>
                    <span className={`text-xs px-2 py-0.5 rounded ${user.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>{user.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
