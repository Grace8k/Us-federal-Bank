import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useBankingStore } from '@/store/bankingStore'
import { AdminLayout } from '@/components/AdminLayout'

export const Route = createFileRoute('/admin/reports')({
  component: AdminReportsPage,
})

function AdminReportsPage() {
  const { users, transactions } = useBankingStore()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  // Monthly transaction summary
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthTxs = transactions.filter(t => t.date.startsWith(month))
    return {
      month: d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      count: monthTxs.length,
      volume: monthTxs.reduce((s, t) => s + t.amount, 0),
    }
  }).reverse()

  const typeBreakdown = ['transfer', 'deposit', 'withdrawal', 'bill_payment', 'airtime', 'wire_transfer', 'loan_disbursement', 'fixed_deposit'].map(type => ({
    type,
    count: transactions.filter(t => t.type === type).length,
    volume: transactions.filter(t => t.type === type).reduce((s, t) => s + t.amount, 0),
  })).filter(t => t.count > 0)

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Reports & Analytics</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Total Users</div>
            <div className="text-2xl font-bold text-white">{users.length}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Total Deposits</div>
            <div className="text-2xl font-bold text-white">${users.reduce((s, u) => s + u.balance, 0).toFixed(2)}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Total Transactions</div>
            <div className="text-2xl font-bold text-white">{transactions.length}</div>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="text-slate-400 text-xs mb-1">Transaction Volume</div>
            <div className="text-2xl font-bold text-white">${transactions.reduce((s, t) => s + t.amount, 0).toFixed(2)}</div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h3 className="text-white font-semibold mb-4">Monthly Transaction Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="px-4 py-2 text-left text-slate-400">Month</th>
                  <th className="px-4 py-2 text-right text-slate-400">Transactions</th>
                  <th className="px-4 py-2 text-right text-slate-400">Volume</th>
                  <th className="px-4 py-2 text-left text-slate-400">Bar</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map(row => {
                  const maxVol = Math.max(...monthlyData.map(r => r.volume))
                  const pct = maxVol > 0 ? (row.volume / maxVol) * 100 : 0
                  return (
                    <tr key={row.month} className="border-b border-slate-700">
                      <td className="px-4 py-2 text-white">{row.month}</td>
                      <td className="px-4 py-2 text-right text-slate-300">{row.count}</td>
                      <td className="px-4 py-2 text-right text-white font-medium">${row.volume.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <div className="bg-slate-700 rounded-full h-2 w-32">
                          <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: '#c9a227' }} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Type Breakdown */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h3 className="text-white font-semibold mb-4">Transaction Type Breakdown</h3>
          <div className="space-y-3">
            {typeBreakdown.map(row => {
              const maxVol = Math.max(...typeBreakdown.map(r => r.volume))
              const pct = maxVol > 0 ? (row.volume / maxVol) * 100 : 0
              return (
                <div key={row.type} className="flex items-center gap-4">
                  <div className="w-32 text-slate-300 text-sm capitalize">{row.type.replace('_', ' ')}</div>
                  <div className="flex-1 bg-slate-700 rounded-full h-3">
                    <div className="h-3 rounded-full bg-blue-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="text-slate-400 text-xs w-20 text-right">{row.count} txns</div>
                  <div className="text-white text-sm w-24 text-right">${row.volume.toFixed(2)}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
